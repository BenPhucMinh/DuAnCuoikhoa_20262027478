const mongoose = require('mongoose');

const nhaSanXuatSchema = new mongoose.Schema({
  id: Number,
  id_nsx: Number,
  ten_nsx: String,
  quoc_gia: String
}, { strict: false });

module.exports = mongoose.model('NhaSanXuat', nhaSanXuatSchema, 'nha_san_xuat');
