const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// === ĐỊNH NGHĨA CẤU TRÚC CHUNG CHO SẢN PHẨM (LÂM SẢN HOẶC LOÀI NUÔI) ===
const ProductSchema = new mongoose.Schema({
    // Trường chung
    tenLamSan: { type: String, required: true }, // Tên lâm sản hoặc tên loài nuôi
    tenKhoaHoc: { type: String },
    khoiLuong: { type: Number, required: true }, // Dùng để lưu 'Khối lượng' (gỗ) hoặc 'Tổng đàn' (loài nuôi)
    donViTinh: { type: String }, // Ví dụ: 'm³' hoặc 'cá thể'
    ngayDangKy: { type: Date, default: Date.now },

    // --- CÁC TRƯỜNG MỚI ĐÃ THÊM CHO LOÀI NUÔI ---
    mucDichNuoi: { type: String },
    hinhThucNuoi: { type: String },
    maSoCoSoGayNuoi: { type: String },

    // Các trường dành riêng cho kinh doanh gỗ
    loaiHinhCheBienGo: { type: String },
    nguonGocGo: { type: String }
});


// === ĐỊNH NGHĨA CẤU TRÚC CHO CƠ SỞ ===
const FarmSchema = new mongoose.Schema({
    // Thông tin cơ sở (giữ nguyên)
    tenCoSo: { type: String, required: true },
    tinhThanhPho: { type: String, required: true },
    xaPhuong: { type: String, required: true },
    diaChiCoSo: { type: String, required: true },
    vido: { type: String },
    kinhdo: { type: String },
    ngayThanhLap: { type: Date },
    giayPhepKinhDoanh: { type: String },
    ghiChu: { type: String },
    trangThai: { type: String, enum: ['Đang hoạt động', 'Tạm ngưng', 'Đã đóng cửa'], default: 'Đang hoạt động' },

    // Thông tin người đại diện (giữ nguyên)
    tenNguoiDaiDien: { type: String, required: true },
    namSinh: { type: Number },
    soCCCD: { type: String, required: true },
    ngayCapCCCD: { type: Date },
    noiCapCCCD: { type: String },
    soDienThoaiNguoiDaiDien: { type: String },
    diaChiNguoiDaiDien: { type: String },
    emailNguoiDaiDien: { type: String },

    // Loại cơ sở đăng ký (đã cập nhật)
    loaiCoSoDangKy: {
        type: String,
        enum: [
            'Đăng ký cơ sở gây nuôi', 
            'Đăng ký cơ sở kinh doanh, chế biến gỗ',
            'Đăng ký cơ sở nuôi, động vật' // <-- ĐÃ THÊM LOẠI MỚI
        ],
        required: true
    },

    // Mảng để chứa nhiều lâm sản hoặc loài nuôi
    products: [ProductSchema],

    // Các trường dành riêng cho từng loại cơ sở (nếu cần)
    loaiHinhKinhDoanhGo: { type: String },
    nganhNgheKinhDoanhGo: { type: String },

    // Thông tin giấy phép (giữ nguyên)
    issueDate: { type: Date },
    expiryDate: { type: Date },
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

FarmSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Farm', FarmSchema);