const express = require('express');
const router = express.Router();

const {
    createFarm,
    getAllFarms,
    getFarmById,
    updateFarm,
    deleteFarm,
    bulkCreateFarms,
    addProductToFarm,
} = require('../controllers/farmController');

// Middleware bảo vệ nếu cần (tuỳ bạn bật/tắt)
const { protect } = require('../middleware/authMiddleware');

// === ROUTES ===

// 🟢 Tạo mới một cơ sở
router.post('/', protect, createFarm);

// 📄 Lấy tất cả cơ sở
router.get('/', protect, getAllFarms);

// 📄 Lấy một cơ sở theo ID
router.get('/:id', protect, getFarmById);

// 📝 Cập nhật cơ sở
router.put('/:id', protect, updateFarm);

// ❌ Xoá cơ sở
router.delete('/:id', protect, deleteFarm);

// 📥 Tạo hàng loạt cơ sở từ file Excel hoặc dữ liệu lớn
router.post('/bulk', protect, bulkCreateFarms);

// ➕ Thêm lâm sản hoặc loài nuôi vào cơ sở
router.post('/:id/products', protect, addProductToFarm);

module.exports = router;
