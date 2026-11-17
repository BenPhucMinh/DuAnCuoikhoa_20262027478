require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public13'));

// ✅ IMPORT MODELS FIRST — BEFORE connecting to DB!
const NhaSanXuat = require('./models/NhaSanXuat');
const NhaCungCap = require('./models/NhaCungCap');
const NhomATC = require('./models/NhomATC');
const Thuoc = require('./models/Thuoc');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB — pharmacyDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ========== API ROUTES — ALL HERE ✅ ==========

// Test route
app.get('/api/', (req, res) => {
  res.json({ message: '✅ Pharmacy API is working!' });
});

// Get all medicines
app.get('/api/medicines', async (req, res) => {
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

// Search medicines by name
app.get('/api/medicines/search/:name', async (req, res) => {
  try {
    const medicines = await Thuoc.find({
      ten_thanh_pham: { $regex: req.params.name, $options: 'i' }
    });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
