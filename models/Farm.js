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
  tongDan: { type: Number },
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

const FarmSchema = new mongoose.Schema({
    // Thông tin cơ sở
    tenCoSo: { type: String, required: true },
    loaiCoSoDangKy: { type: String, required: true },
    province: { type: String, required: true },
    commune: { type: String, required: true },
    diaChiCoSo: { type: String, required: true },
    vido: { type: String },
    kinhdo: { type: String },
    ngayThanhLap: { type: Date },
    trangThai: { type: String, default: 'Đang hoạt động' },
    
    // Thông tin người đại diện
    tenNguoiDaiDien: { type: String, required: true },
    namSinh: { type: String },
    soCCCD: { type: String, required: true },
    ngayCapCCCD: { type: Date },
    noiCapCCCD: { type: String },
    soDienThoaiNguoiDaiDien: { type: String },
    diaChiNguoiDaiDien: { type: String },

    // Thông tin giấy phép
    giayPhepKinhDoanh: { type: String },
    issueDate: { type: Date }, // Ngày cấp phép
    expiryDate: { type: Date }, // Ngày hết hạn

    // Các trường dành riêng cho từng loại hình
    mucDichNuoi: { type: String },
    hinhThucNuoi: { type: String },
    maSoCoSoGayNuoi: { type: String },
    nganhNgheKinhDoanhGo: { type: String },
    loaiHinhKinhDoanhGo: { type: String },
     
  thongTinDan: thongTinDanSchema,
}, { timestamps: true });

module.exports = mongoose.model('Farm', FarmSchema);
