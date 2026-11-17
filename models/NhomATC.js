const mongoose = require('mongoose');

const nhomATCSchema = new mongoose.Schema({
  id: Number,
  id_nhom: Number,
  ma_nhom: mongoose.Schema.Types.Mixed,
  ten_nhom: String,
  ten_chinh: String
}, { strict: false });

module.exports = mongoose.model('NhomATC', nhomATCSchema, 'nhom_atc');
