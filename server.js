require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// ========== MODELS ==========
const User = require('./models/userlogin');
const Patient = require('./models/patients12');
const Medicine = require('./models/medicines12');
const Prescription = require('./models/prescription12');
const NhaSanXuat = require('./models/NhaSanXuat');
const NhaCungCap = require('./models/NhaCungCap');
const NhomATC = require('./models/NhomATC');
const Thuoc = require('./models/Thuoc');

const JWT_SECRET = 'your-secret-key-change-this-later';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ========== SERVE STATIC FILES ==========
// Phase 2 pages live under /public13 — serve them at root so
// links like "medicines11.html" resolve from the browser.
app.use(express.static(path.join(__dirname, 'public13')));
// Phase 1 pages (dashboard11.html, projectmod1.html, etc.) live in the project root
app.use(express.static(__dirname));

// ========== MONGODB ==========
const MONGODB_URI = process.env.MONGODB_URI ||
  'mongodb+srv://unknownphuc24_db_user:ZSRdAFTg9AGjDHkg@cluster0ben45.ijcyxhs.mongodb.net/pharmacyDB?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ Connected to MongoDB Atlas — pharmacyDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ========== TEST ROUTE ==========
app.get('/api/', (req, res) => {
  res.json({ message: '✅ Pharmacy API is working!' });
});

// =============================================
// ===== PHASE 1 — AUTH / PATIENTS / MEDS =====
// =============================================

// ========== REGISTER ==========
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ email, password: hashedPassword, fullName, phone, role });
    await user.save();
    res.status(201).json({ message: '✅ Account created successfully!' });
  } catch (err) {
    res.status(500).json({ message: '❌ Error: ' + err.message });
  }
});

// ========== LOGIN ==========
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email or password incorrect' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email or password incorrect' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Error: ' + err.message });
  }
});

// ========== PATIENTS ==========
app.post('/api/patients', async (req, res) => {
  try {
    const { fullName, age, phone, allergies, medicalHistory, createdBy } = req.body;
    const existing = await Patient.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: '❌ Số điện thoại đã tồn tại!' });
    }
    const patient = new Patient({ fullName, age, phone, allergies, medicalHistory, createdBy });
    await patient.save();
    res.status(201).json({ message: '✅ Tạo hồ sơ thành công!', patient });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.get('/api/patients/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const query = q ? {
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    } : {};
    const patients = await Patient.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'fullName role');
    const total = await Patient.countDocuments(query);
    res.json({
      patients,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: '❌ Không tìm thấy hồ sơ bệnh nhân!' });
    }
    res.json({ message: `✅ Đã xóa hồ sơ "${patient.fullName}"!` });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('createdBy', 'fullName role');
    if (!patient) {
      return res.status(404).json({ message: '❌ Không tìm thấy hồ sơ!' });
    }
    res.json({ patient, prescriptions: [] });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

// ========== MEDICINES (Phase 1 — CRUD) ==========
app.post('/api/medicines', async (req, res) => {
  try {
    const { name, category, dosage, stock, unit, price, lowStockAlert, createdBy } = req.body;
    const medicine = new Medicine({ name, category, dosage, stock, unit, price, lowStockAlert, createdBy });
    await medicine.save();
    res.status(201).json({ message: '✅ Thêm thuốc thành công!', medicine });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.get('/api/medicines/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;
    const query = q ? { name: { $regex: q, $options: 'i' } } : {};
    const medicines = await Medicine.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'fullName');
    const total = await Medicine.countDocuments(query);
    const list = medicines.map(m => ({
      ...m.toObject(),
      isLowStock: m.stock <= m.lowStockAlert
    }));
    res.json({
      medicines: list,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: '❌ Không tìm thấy thuốc!' });
    }
    res.json({ message: `✅ Đã xóa thuốc "${medicine.name}"!` });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.patch('/api/medicines/:id/stock', async (req, res) => {
  try {
    const { stockChange } = req.body;
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: '❌ Không tìm thấy thuốc!' });
    }
    medicine.stock = Math.max(0, medicine.stock + stockChange);
    await medicine.save();
    res.json({ message: '✅ Cập nhật tồn kho!', medicine });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

// ========== PRESCRIPTIONS ==========
app.post('/api/prescriptions', async (req, res) => {
  try {
    const { patientId, medicines, notes, createdBy } = req.body;
    for (const item of medicines) {
      const med = await Medicine.findById(item.medicine);
      if (!med) {
        return res.status(404).json({ message: '❌ Thuốc không tồn tại!' });
      }
      if (med.stock < item.quantity) {
        return res.status(400).json({
          message: `❌ Không đủ tồn kho: ${med.name} — Còn ${med.stock}, cần ${item.quantity}`
        });
      }
    }
    const prescription = new Prescription({
      patient: patientId,
      medicines,
      notes,
      createdBy,
      status: 'pending'
    });
    await prescription.save();
    res.status(201).json({ message: '✅ Đơn thuốc đã gửi chờ duyệt!', prescription });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.patch('/api/prescriptions/:id/approve', async (req, res) => {
  try {
    const { approvedBy } = req.body;
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient')
      .populate('medicines.medicine');
    if (!prescription) {
      return res.status(404).json({ message: '❌ Không tìm thấy đơn thuốc!' });
    }
    if (prescription.status !== 'pending') {
      return res.status(400).json({ message: '❌ Đơn đã được xử lý!' });
    }
    for (const item of prescription.medicines) {
      const med = await Medicine.findById(item.medicine._id);
      med.stock = Math.max(0, med.stock - item.quantity);
      await med.save();
    }
    prescription.status = 'approved';
    prescription.approvedBy = approvedBy;
    prescription.approvedAt = new Date();
    await prescription.save();
    res.json({ message: '✅ Đơn thuốc đã duyệt & cập nhật kho!', prescription });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.patch('/api/prescriptions/:id/reject', async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: '❌ Không tìm thấy đơn thuốc!' });
    }
    if (prescription.status !== 'pending') {
      return res.status(400).json({ message: '❌ Đơn đã được xử lý!' });
    }
    prescription.status = 'rejected';
    await prescription.save();
    res.json({ message: '✅ Đơn thuốc đã từ chối', prescription });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.delete('/api/prescriptions/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: '❌ Không tìm thấy đơn thuốc!' });
    }
    res.json({ message: '✅ Đã xóa đơn thuốc!' });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.get('/api/prescriptions', async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'fullName phone')
      .populate('medicines.medicine', 'name dosage stock')
      .populate('createdBy', 'fullName role')
      .populate('approvedBy', 'fullName role')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

// ========== STAFF ==========
app.get('/api/staff', async (req, res) => {
  try {
    const staff = await User.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.patch('/api/staff/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['admin', 'pharmacist', 'nurse'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: '❌ Vai trò không hợp lệ!' });
    }
    const staff = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!staff) {
      return res.status(404).json({ message: '❌ Không tìm thấy người dùng!' });
    }
    res.json({ message: '✅ Cập nhật vai trò thành công!', staff });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    const staff = await User.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: '❌ Không tìm thấy người dùng!' });
    }
    res.json({ message: '✅ Xóa tài khoản thành công!' });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

// ========== HISTORY & EXPORT ==========
app.get('/api/history/all', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    const prescriptions = await Prescription.find()
      .populate('patient', 'fullName phone')
      .populate('medicines.medicine', 'name')
      .populate('createdBy', 'fullName role')
      .populate('approvedBy', 'fullName role')
      .sort({ createdAt: -1 });
    res.json({ patients, medicines, prescriptions });
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.get('/api/export/prescriptions/csv', async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate('patient', 'fullName phone')
      .populate('medicines.medicine', 'name')
      .populate('createdBy', 'fullName')
      .populate('approvedBy', 'fullName')
      .sort({ createdAt: -1 });

    let csv = 'Ngày,Tên Bệnh Nhân,Số Điện Thoại,Thuốc,Số Lượng,Tạo Bởi,Duyệt Bởi,Trạng Thái,Ghi Chú\n';
    prescriptions.forEach(p => {
      const date = new Date(p.createdAt).toLocaleDateString('vi-VN');
      const patientName = p.patient?.fullName || 'Không xác định';
      const phone = p.patient?.phone || '';
      const createdBy = p.createdBy?.fullName || '';
      const approvedBy = p.approvedBy?.fullName || 'Chưa duyệt';
      const status = p.status === 'approved' ? 'Đã duyệt' :
                     p.status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt';
      const notes = (p.notes || '').replace(/,/g, ';');
      p.medicines.forEach(item => {
        const medName = item.medicine?.name || 'Không xác định';
        csv += `${date},"${patientName}","${phone}","${medName}",${item.quantity},"${createdBy}","${approvedBy}","${status}","${notes}"\n`;
      });
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=danh_sach_don_thuoc.csv');
    res.send('\uFEFF' + csv);
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

app.get('/api/export/patients/csv', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    let csv = 'Tên Bệnh Nhân,Số Điện Thoại,Ngày Tạo\n';
    patients.forEach(p => {
      const date = new Date(p.createdAt).toLocaleDateString('vi-VN');
      csv += `"${p.fullName || ''}","${p.phone || ''}","${date}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=danh_sach_benh_nhan.csv');
    res.send('\uFEFF' + csv);
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi: ' + err.message });
  }
});

// =============================================
// ===== PHASE 2 — PHARMACEUTICAL DATABASE =====
// =============================================

// Get all medicines (Phase 2 — full pharmaceutical DB)
app.get('/api/medicines-db', async (req, res) => {
  try {
    const medicines = await Thuoc.find({});
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all manufacturers
app.get('/api/manufacturers', async (req, res) => {
  try {
    const manufacturers = await NhaSanXuat.find({});
    res.json(manufacturers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await NhaCungCap.find({});
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all ATC groups
app.get('/api/atc', async (req, res) => {
  try {
    const atc = await NhomATC.find({});
    res.json(atc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search medicines (Phase 2) by name
app.get('/api/medicines-db/search/:name', async (req, res) => {
  try {
    const medicines = await Thuoc.find({
      $or: [
        { TEN_THANH_PHAM: { $regex: req.params.name, $options: 'i' } },
        { ten_thanh_pham: { $regex: req.params.name, $options: 'i' } }
      ]
    });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========== START SERVER ==========
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

