const mongoose = require('mongoose');

const thuocSchema = new mongoose.Schema({
  STT: Number,
  stt: Number,
  id: Number,
  id_thuoc: Number,
  MA_PM: String,
  ma_pm: String,
  TEN_THANH_PHAM: String,
  ten_thanh_pham: String,
  TEN_HOAT_CHAT: String,
  ten_hoat_chat: String,
  HAMLUONG: String,
  ham_luong: String,
  DVT: String,
  dvt: String,
  DUONGDUNG: String,
  duong_dung: String,
  SO_DANG_KY: String,
  so_dang_ky: String,
  DONGIA: Number,
  don_gia: Number,
  TEN_NHA_SAN_XUAT: String,
  ten_nha_san_xuat: String,
  ten_nsx: String,
  TENNUOC_SX: String,
  quoc_gia: String,
  TEN_NCC: String,
  ten_ncc: String,
  TENNHOM: String,
  ten_nhom: String
}, { strict: false });

module.exports = mongoose.model('Thuoc', thuocSchema, 'thuoc');
