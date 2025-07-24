const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
    try {
        const pipeline = [
            // Bước này sẽ chỉ lấy ra các cơ sở có ít nhất 1 sản phẩm trong mảng
            { $unwind: "$products" }, 
            
            // Bước này định hình lại dữ liệu để dễ sử dụng
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
                    // ... các trường khác từ cơ sở cha
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