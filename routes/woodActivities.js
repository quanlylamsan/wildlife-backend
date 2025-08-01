const express = require('express');
const router = express.Router();

// Import các hàm xử lý từ controller
const {
    createWoodActivity,
    getWoodActivitiesByWoodId,
    getWoodActivityById,
    updateWoodActivity,
    deleteWoodActivity
} = require('../controllers/woodActivityController');

// Import middleware bảo mật
const { protect, isAdmin } = require('../middleware/authMiddleware');

// --- Định nghĩa các API routes ---

// @route   POST /api/wood-activities
// @desc    Tạo một bản ghi hoạt động gỗ mới
// @access  Private (Staff or Admin)
router.post('/', protect, createWoodActivity);

// @route   GET /api/wood-activities/:woodId
// @desc    Lấy danh sách hoạt động cho một mục gỗ cụ thể
// @access  Private
router.get('/:woodId', protect, getWoodActivitiesByWoodId);

// @route   GET /api/wood-activities/detail/:id
// @desc    Lấy một bản ghi hoạt động bằng ID
// @access  Private
router.get('/detail/:id', protect, getWoodActivityById);

// @route   PUT /api/wood-activities/:id
// @desc    Cập nhật một bản ghi hoạt động
// @access  Private (Staff or Admin)
router.put('/:id', protect, updateWoodActivity);

// @route   DELETE /api/wood-activities/:id
// @desc    Xóa một bản ghi hoạt động
// @access  Private (Admin only)
router.delete('/:id', protect, isAdmin, deleteWoodActivity);

module.exports = router;
