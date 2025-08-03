const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware'); // <-- Sử dụng middleware bạn đã viết

// Route đăng nhập (đã có)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
});

// 🆕 Route lấy thông tin người dùng từ token
router.get('/me', protect, async (req, res) => {
  try {
    res.json(req.user); // `req.user` đã được middleware `protect` gán ở bước trước
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng.' });
  }
});

module.exports = router;
