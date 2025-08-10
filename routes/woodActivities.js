// File: routes/woodActivities.js
const express = require('express');
const router = express.Router();

const {
    createWoodActivity,
    getWoodActivitiesByWoodId,
    getWoodActivityById,
    updateWoodActivity,
    deleteWoodActivity
} = require('../controllers/woodActivityController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

// Tạo một bản ghi hoạt động gỗ mới
router.post('/', protect, createWoodActivity);

// Lấy chi tiết 1 hoạt động
router.get('/detail/:id', protect, getWoodActivityById);

// Lấy danh sách hoạt động theo woodId — ĐỔI TÊN ROUTE
router.get('/by-wood/:woodId', protect, getWoodActivitiesByWoodId);

// Cập nhật 1 hoạt động
router.put('/:id', protect, updateWoodActivity);

// Xoá 1 hoạt động
router.delete('/:id', protect, isAdmin, deleteWoodActivity);

module.exports = router;
