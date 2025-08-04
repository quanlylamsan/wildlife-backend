const express = require('express');
const router = express.Router();

// Controller functions
const {
    createFarm,
    getAllFarms,
    getFarmById,
    updateFarm,
    deleteFarm,
    bulkCreateFarms,
    addWoodProductToFarm, // MỚI
	addAnimalProductToFarm, // MỚI
} = require('../controllers/farmController');

// Optional auth middleware
const { protect } = require('../middleware/authMiddleware');

// ================== FARM ROUTES ==================

// ➕ Tạo cơ sở mới
router.post('/', protect, createFarm);

// 📄 Lấy toàn bộ danh sách cơ sở
router.get('/', protect, getAllFarms);

// 🔍 Lấy thông tin 1 cơ sở theo ID
router.get('/:id', protect, getFarmById);

// ✏️ Cập nhật thông tin cơ sở
router.put('/:id', protect, updateFarm);

// ❌ Xoá cơ sở
router.delete('/:id', protect, deleteFarm);

// 📥 Tạo hàng loạt cơ sở từ Excel / danh sách
router.post('/bulk', protect, bulkCreateFarms);


// ==== CÁC ROUTE MỚI RÕ RÀNG ====
router.post('/:id/products/wood', protect, addWoodProductToFarm);     // GỖ
router.post('/:id/products/animal', protect, addAnimalProductToFarm); // ĐỘNG VẬT

module.exports = router;
