const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const NhaSanXuat = require('./models/NhaSanXuat');
const NhaCungCap = require('./models/NhaCungCap');
const NhomATC = require('./models/NhomATC');
const Thuoc = require('./models/Thuoc');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://unknownphuc24_db_user:ZSRdAFTg9AGjDHkg@cluster0ben45.ijcyxhs.mongodb.net/pharmacyDB?retryWrites=true&w=majority';

const loadJSON = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📂 Loading JSON files...');
    const manufacturers = loadJSON('nha_san_xuat (3).json');
    const suppliers = loadJSON('nha_cung_cap (3).json');
    const atcGroups = loadJSON('nhom_atc (3).json');
    const medicines = loadJSON('main sheet 01 (2).json');

    console.log('🚀 Importing manufacturers...');
    await NhaSanXuat.deleteMany({});
    await NhaSanXuat.insertMany(manufacturers);
    console.log(`✅ ${manufacturers.length} manufacturers`);

    console.log('🚀 Importing suppliers...');
    await NhaCungCap.deleteMany({});
    await NhaCungCap.insertMany(suppliers);
    console.log(`✅ ${suppliers.length} suppliers`);

    console.log('🚀 Importing ATC groups...');
    await NhomATC.deleteMany({});
    await NhomATC.insertMany(atcGroups);
    console.log(`✅ ${atcGroups.length} ATC groups`);

    console.log('🚀 Importing medicines...');
    await Thuoc.deleteMany({});
    await Thuoc.insertMany(medicines);
    console.log(`✅ ${medicines.length} medicines`);

    console.log('\n🎉 ALL DONE! Data is in your database!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
