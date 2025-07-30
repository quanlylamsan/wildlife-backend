// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route   POST /api/auth/login
// @desc    Đăng nhập người dùng
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Trả về token và cả đối tượng user đầy đủ (trừ password)
    res.json({ 
      token, 
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        displayName: user.displayName
      }
    });

  } catch (err) {
    console.error('Lỗi khi đăng nhập (backend):', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
});

// ... Thêm route đăng ký ở đây nếu cần ...

module.exports = router;