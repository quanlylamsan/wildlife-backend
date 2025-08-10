// File: ./routes/masterList.js

const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const masterListController = require('../controllers/masterListController');
const { protect } = require('../middleware/authMiddleware');

// Route để lấy tất cả tỉnh
// URL cuối cùng: GET /api/master-product-list/provinces
router.get('/provinces', protect, masterListController.getAllProvinces);

// Route để lấy tất cả xã
// URL cuối cùng: GET /api/master-product-list/communes
router.get('/communes', protect, masterListController.getAllCommunes);


// PHẦN BỊ THIẾU: BẠN CẦN THÊM TOÀN BỘ ĐOẠN NÀY VÀO
// -------------------------------------------------------------------
// Route để lấy dữ liệu tổng hợp cho Bảng Tổng Hợp
// URL cuối cùng: GET /api/master-product-list
router.get('/', protect, async (req, res) => {
    try {
        const pipeline = [
            // Tách mỗi sản phẩm trong mảng woodProducts thành một document riêng
            { $unwind: "$woodProducts" },
            // Chọn và định dạng lại các trường cần thiết
            {
                $project: {
                    _id: "$woodProducts._id",
                    tenLamSan: "$woodProducts.tenLamSan",
                    khoiLuong: "$woodProducts.khoiLuong",
                    donViTinh: "$woodProducts.donViTinh", // Giả sử có trường này trong schema
                    nguonGocGo: "$woodProducts.nguonGocGo",
                    ngayDangKyLamSan: "$woodProducts.ngayDangKy", // Giả sử có trường này
                    farmId: "$_id",
                    tenCoSo: "$tenCoSo",
                    tinhThanhPho: "$provinceName", // Lấy tên tỉnh
                    diaChiCoSo: "$diaChiCoSo",
                    trangThai: "$trangThai",
                    tenNguoiDaiDien: "$tenNguoiDaiDien",
                    soCCCD: "$soCCCD"
                }
            }
        ];

        const masterList = await Farm.aggregate(pipeline);
        res.status(200).json(masterList);

    } catch (err) {
        console.error("Lỗi khi tạo master list:", err);
        res.status(500).json({ message: "Lỗi máy chủ" });
    }
});
// -------------------------------------------------------------------

module.exports = router;