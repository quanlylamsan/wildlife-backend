const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const masterListController = require('../controllers/masterListController');

// SỬA LỖI: Import đúng tên hàm từ authMiddleware
const { protect } = require('../middleware/authMiddleware');

// Sử dụng đúng tên hàm đã import
router.get('/provinces', protect, masterListController.getAllProvinces);
router.get('/communes', protect, masterListController.getCommunesByProvince);
router.get('/', protect, async (req, res) => {
    try {
        const pipeline = [
            { $unwind: "$products" }, 
            { 
                $project: {
                    _id: "$products._id",
                    tenLamSan: "$products.tenLamSan",
                    khoiLuong: "$products.khoiLuong",
                    donViTinh: "$products.donViTinh",
                    nguonGocGo: "$products.nguonGocGo",
                    ngayDangKyLamSan: "$products.ngayDangKy",
                    farmId: "$_id",
                    tenCoSo: "$tenCoSo",
                    tinhThanhPho: "$tinhThanhPho",
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

module.exports = router;
