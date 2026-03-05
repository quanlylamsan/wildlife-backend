const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const { protect } = require('../middleware/authMiddleware');

// Route lấy bảng tổng hợp động vật
// URL: GET /api/master-animal-list

router.get('/', protect, async (req, res) => {

  try {

    const pipeline = [

      // Tách từng animalProducts thành 1 document
      { $unwind: "$animalProducts" },

      // Chọn các field cần
      {
        $project: {

          _id: "$animalProducts._id",

          tenLoai: "$animalProducts.tenLamSan",
          tenKhoaHoc: "$animalProducts.tenKhoaHoc",

          danBoMeDuc: "$animalProducts.danBoMe.duc",
          danBoMeCai: "$animalProducts.danBoMe.cai",

          danHauBiDuc: "$animalProducts.danHauBi.duc",
          danHauBiCai: "$animalProducts.danHauBi.cai",

          duoiMotTuoi: "$animalProducts.duoiMotTuoi",
          trenMotTuoi: "$animalProducts.trenMotTuoi",

          farmId: "$_id",
          tenCoSo: "$tenCoSo",

          tinhThanhPho: "$provinceName",
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

    console.error("Lỗi khi tạo master animal list:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });

  }

});

module.exports = router;