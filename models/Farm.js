const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// === SCHEMA CHO SẢN PHẨM (LÂM SẢN HOẶC LOÀI NUÔI) ===
const ProductSchema = new mongoose.Schema({
    // Chung
    tenLamSan: { type: String, required: [true, 'Vui lòng nhập tên lâm sản hoặc loài nuôi'] },
    tenKhoaHoc: { type: String },
    khoiLuong: { type: Number, required: [true, 'Vui lòng nhập khối lượng hoặc tổng đàn'] },
    donViTinh: { type: String },
    ngayDangKy: { type: Date, default: Date.now },

    // Cho cơ sở gây nuôi
    mucDichNuoi: { type: String },
    hinhThucNuoi: { type: String },
    maSoCoSoGayNuoi: { type: String },

    // Cho cơ sở gỗ
    loaiHinhCheBienGo: { type: String },
    nguonGocGo: { type: String }
});

// === SCHEMA CHO CƠ SỞ ===
const FarmSchema = new mongoose.Schema({
    // Thông tin cơ bản
    tenCoSo: { type: String, required: [true, 'Vui lòng nhập tên cơ sở'] },
    tinhThanhPho: { type: String, required: [true, 'Vui lòng chọn tỉnh/thành'] },
    xaPhuong: { type: String, required: [true, 'Vui lòng chọn xã/phường'] },
    diaChiCoSo: { type: String, required: [true, 'Vui lòng nhập địa chỉ cơ sở'] },
    vido: { type: String },
    kinhdo: { type: String },
    ngayThanhLap: { type: Date },
    giayPhepKinhDoanh: { type: String },
    ghiChu: { type: String },
    trangThai: {
        type: String,
        enum: ['Đang hoạt động', 'Tạm ngưng', 'Đã đóng cửa'],
        default: 'Đang hoạt động'
    },

    // Thông tin người đại diện
    tenNguoiDaiDien: { type: String, required: [true, 'Vui lòng nhập tên người đại diện'] },
    namSinh: { type: Number },
    soCCCD: { type: String, required: [true, 'Vui lòng nhập số CCCD'] },
    ngayCapCCCD: { type: Date },
    noiCapCCCD: { type: String },
    soDienThoaiNguoiDaiDien: { type: String },
    diaChiNguoiDaiDien: { type: String },
    emailNguoiDaiDien: { type: String },

    // Phân loại cơ sở
    loaiCoSoDangKy: {
        type: String,
        enum: [
            'Đăng ký cơ sở gây nuôi',
            'Đăng ký cơ sở kinh doanh, chế biến gỗ'
            
        ],
        required: [true, 'Vui lòng chọn loại cơ sở']
    },

    // Danh sách sản phẩm (gỗ hoặc loài nuôi)
    products: [ProductSchema],

    // Chỉ dành cho cơ sở gỗ
    loaiHinhKinhDoanhGo: { type: String },
    nganhNgheKinhDoanhGo: { type: String },

    // Thông tin giấy phép
    issueDate: { type: Date },
    expiryDate: { type: Date },
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

FarmSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Farm', FarmSchema);
