const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// Import middleware bảo mật
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Gán lại middleware vào các route để bảo vệ
// Chỉ những người dùng đã đăng nhập (protect) và có vai trò admin (isAdmin) mới có thể truy cập
router.get('/', protect, isAdmin, getUsers);
router.post('/', protect, isAdmin, createUser);
router.get('/:id', protect, isAdmin, getUserById);
router.put('/:id', protect, isAdmin, updateUser);
router.delete('/:id', protect, isAdmin, deleteUser);

module.exports = router;
