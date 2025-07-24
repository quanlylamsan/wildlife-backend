const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Đảm bảo đúng đường dẫn đến User model
const bcrypt = require('bcryptjs'); // Cần import bcryptjs để so sánh mật khẩu
const jwt = require('jsonwebtoken'); // Cần import jsonwebtoken để tạo token

// Route Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // 2. So sánh mật khẩu đã hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // 3. Tạo JWT Token
    // Đảm bảo JWT_SECRET được định nghĩa trong file .env của bạn
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // <--- BIẾN MÔI TRƯỜNG JWT_SECRET CỦA BẠN
      { expiresIn: '1h' } // Token sẽ hết hạn sau 1 giờ
    );

    // 4. Trả về token và role cho frontend
    res.json({ token, role: user.role });

  } catch (err) {
    console.error('Lỗi khi đăng nhập:', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
});

module.exports = router;