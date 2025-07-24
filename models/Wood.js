// backend/models/Wood.js
const mongoose = require('mongoose');

const WoodSchema = new mongoose.Schema({
  tenGo: {
    type: String,
    required: true,
    trim: true,
  },
  diaChiLuuTru: {
    type: String,
    trim: true,
  },
  loaiGo: [{
    tenLoaiGo: { type: String, trim: true },
  }],
  // --- BẮT ĐẦU THÊM TRƯỜNG MỚI ---
  loaiHinhCheBienGo: {
    type: String,
    trim: true,
    enum: ['Tròn', 'Xẻ', 'Thành phẩm', '']
  },
  nguonGocGo: {
    type: String,
    trim: true,
    enum: ['Nhập khẩu', 'Vườn', 'Khác', '']
  },
  // --- KẾT THÚC THÊM TRƯỜNG MỚI ---
}, { 
    timestamps: true,
    collection: 'farms'
});

module.exports = mongoose.model('Wood', WoodSchema);