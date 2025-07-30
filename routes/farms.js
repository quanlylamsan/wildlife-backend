const express = require('express');
const router = express.Router();

// Import các hàm xử lý từ controller
const {
    createFarm,
    getAllFarms,
    getFarmById,
    updateFarm,
    deleteFarm
} = require('../controllers/farmController');

// Import middleware bảo mật
const { protect, isAdminOrManager } = require('../middleware/authMiddleware');

// --- Định nghĩa các API routes ---
router.post('/', protect, createFarm);
router.get('/', protect, getAllFarms);
router.get('/:id', protect, getFarmById);
router.put('/:id', protect, isAdminOrManager, updateFarm);
router.delete('/:id', protect, isAdminOrManager, deleteFarm);

module.exports = router;
