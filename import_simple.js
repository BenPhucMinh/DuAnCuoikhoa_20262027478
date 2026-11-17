const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const NhaSanXuat = require('./models/NhaSanXuat');
const NhaCungCap = require('./models/NhaCungCap');
const NhomATC = require('./models/NhomATC');
const Thuoc = require('./models/Thuoc');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://unknownphuc24_db_user:ZSRdAFTg9AGjDHkg@cluster0ben45.ijcyxhs.mongodb.net/pharmacyDB?retryWrites=true&w=majority';

async function importData(model, filePath) {
  try {
    console.log(`📂 Reading ${filePath}...`);
    const fullPath = path.resolve(__dirname, filePath);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    console.log(`📋 Found ${data.length} records`);
    
    await model.deleteMany({}); // clear old records
    await model.insertMany(data, { ordered: false });
    console.log(`✅ Imported successfully!\n`);
  } catch (err) {
    console.error('❌ Error importing:', err.message, '\n');
  }
}

async function main() {
  try {
    console.log('🚀 Starting import...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    await importData(NhaSanXuat, './data/nha_san_xuat (3).json');
    await importData(NhaCungCap, './data/nha_cung_cap (3).json');
    await importData(NhomATC, './data/nhom_atc (3).json');
    await importData(Thuoc, './data/main sheet 01 (2).json');

    console.log('🎉 ALL DONE!');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

main();
