// models/Farm.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  tenLamSan: { type: String, required: true },
  tenKhoaHoc: { type: String },
  khoiLuong: { type: Number, required: true },
  loaiHinhCheBienGo: { type: String },
  nguonGocGo: { type: String }
}, { _id: false });

const AnimalProductSchema = new mongoose.Schema({
  tenLamSan: { type: String, required: true },
  tenKhoaHoc: { type: String },
  mucDichNuoi: { type: String },
  hinhThucNuoi: { type: String },
  danBoMe: {
    duc: { type: Number, default: 0 },
    cai: { type: Number, default: 0 }
  },
  danHauBi: {
    duc: { type: Number, default: 0 },
    cai: { type: Number, default: 0 }
  },
  duoiMotTuoi: { type: Number, default: 0 },
  trenMotTuoi: { type: Number, default: 0 }
}, { _id: false });

const FarmSchema = new mongoose.Schema({
  tenCoSo: { type: String, required: true },
  loaiCoSoDangKy: { type: String, required: true },

  // Mã + tên tỉnh/xã (giữ mã để query, tên để hiển thị)
  province: { type: String, required: true },     // mã tỉnh
  provinceName: { type: String },                  // tên tỉnh
  commune: { type: String, required: true },      // mã xã
  communeName: { type: String },                  // tên xã

  diaChiCoSo: { type: String, required: true },
  vido: { type: String },
  kinhdo: { type: String },
  ngayThanhLap: { type: Date },
  trangThai: { type: String, default: 'Đang hoạt động' },

  tenNguoiDaiDien: { type: String, required: true },
  namSinh: { type: String },
  soCCCD: { type: String, required: true },
  ngayCapCCCD: { type: Date },
  noiCapCCCD: { type: String },
  soDienThoaiNguoiDaiDien: { type: String },
  diaChiNguoiDaiDien: { type: String },
  emailNguoiDaiDien: { type: String },

  giayPhepKinhDoanh: { type: String },
  issueDate: { type: Date },
  expiryDate: { type: Date },

  // Một vài trường tạm chung (không dùng để lưu danh sách sản phẩm chính)
  mucDichNuoi: { type: String },
  hinhThucNuoi: { type: String },
  maSoCoSoGayNuoi: { type: String },
  nganhNgheKinhDoanhGo: { type: String },
  loaiHinhKinhDoanhGo: { type: String },
  loaiHinhCheBienGo: { type: String },
  nguonGocGo: { type: String },

  // Các mảng sản phẩm thực tế
  woodProducts: { type: [ProductSchema], default: [] },
  animalProducts: { type: [AnimalProductSchema], default: [] }

}, { timestamps: true });

module.exports = mongoose.model('Farm', FarmSchema);
