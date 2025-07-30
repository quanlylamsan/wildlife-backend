// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ Đảm bảo dòng này trỏ đến file middleware mới
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách người dùng:', err.message);
    res.status(500).send('Lỗi Server');
  }
});

// ... các route khác cho user ...

module.exports = router;