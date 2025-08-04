const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// === SCHEMA CHO SẢN PHẨM (LÂM SẢN HOẶC LOÀI NUÔI) ===
const ProductSchema = new mongoose.Schema({
  tenLamSan: { type: String, required: true },
  tenKhoaHoc: { type: String },
  khoiLuong: { type: Number, required: true },
  loaiHinhCheBienGo: { type: String },
  nguonGocGo: { type: String },
}, { timestamps: true });

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

const FarmSchema = new mongoose.Schema({
  tenCoSo: String,
  maSo: String,
  loaiHinhCoSo: String, // gây nuôi / chế biến gỗ
  diaChi: String,
  sanPhamDangKy: [ProductSchema],
  thongTinDan: thongTinDanSchema, // ⬅️ thêm ở đây
}, { timestamps: true });

module.exports = mongoose.model('Farm', FarmSchema);
