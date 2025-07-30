// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController'); // ✅ Import controller

const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // ✅ Middleware xác thực

// ✅ Lấy danh sách tất cả người dùng (chỉ admin)
router.get('/', verifyToken, isAdmin, getUsers);

// ✅ Tạo mới người dùng (chỉ admin)
router.post('/', verifyToken, isAdmin, createUser);

// ✅ Lấy thông tin 1 người dùng (admin)
router.get('/:id', verifyToken, isAdmin, getUserById);

// ✅ Cập nhật người dùng
router.put('/:id', verifyToken, isAdmin, updateUser);

// ✅ Xóa người dùng
router.delete('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;
