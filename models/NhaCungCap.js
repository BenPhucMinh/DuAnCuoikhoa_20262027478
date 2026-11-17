const mongoose = require('mongoose');

const nhaCungCapSchema = new mongoose.Schema({
  id: Number,
  id_ncc: Number,
  ma_ncc: mongoose.Schema.Types.Mixed,
  ten_ncc: String,
  quoc_gia: String,
  "TENNUOC SX": String
}, { strict: false });

module.exports = mongoose.model('NhaCungCap', nhaCungCapSchema, 'nha_cung_cap');
