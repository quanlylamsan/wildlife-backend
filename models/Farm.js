const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// === SCHEMA CHO SẢN PHẨM GỖ ===
const ProductSchema = new mongoose.Schema({
  tenLamSan: { type: String, required: true },
  tenKhoaHoc: { type: String },
  khoiLuong: { type: Number, required: true },
  loaiHinhCheBienGo: { type: String },
  nguonGocGo: { type: String },
}, { timestamps: true });

// === SCHEMA CHO SẢN PHẨM ĐỘNG VẬT ===
const AnimalProductSchema = new mongoose.Schema({
  tenLamSan: { type: String, required: true },
  tenKhoaHoc: { type: String },
  danBoMeDuc: { type: Number, default: 0 },
  danBoMeCai: { type: Number, default: 0 },
  danHauBiDuc: { type: Number, default: 0 },
  danHauBiCai: { type: Number, default: 0 },
  duoiMotTuoi: { type: Number, default: 0 },
  trenMotTuoi: { type: Number, default: 0 },
}, { timestamps: true });

// === SCHEMA CHO THÔNG TIN ĐÀN ===
const thongTinDanSchema = new mongoose.Schema({
  tongDan: { type: Number, default: 0 },
  danBoMe: {
    tong: { type: Number, default: 0 },
    duc: { type: Number, default: 0 },
    cai: { type: Number, default: 0 },
  },
  danHauBi: {
    tong: { type: Number, default: 0 },
    duc: { type: Number, default: 0 },
    cai: { type: Number, default: 0 },
  },
  duoiMotTuoi: { type: Number, default: 0 },
  motTuoiTroLen: { type: Number, default: 0 },
}, { _id: false });

// === SCHEMA FARM CHÍNH ===
const FarmSchema = new mongoose.Schema({
  tenCoSo: String,
  maSo: String,
  loaiHinhCoSo: String, // gây nuôi / chế biến gỗ
  diaChi: String,

  products: [ProductSchema],         // ✅ sản phẩm gỗ
  animalProducts: [AnimalProductSchema], // ✅ sản phẩm động vật

  thongTinDan: thongTinDanSchema,
}, { timestamps: true });

module.exports = mongoose.model('Farm', FarmSchema);
