// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Thêm console.log để kiểm tra dữ liệu nhận được từ client
  console.log('Yêu cầu đăng nhập nhận được. Email:', email);

  try {
    // Kiểm tra input cơ bản trước khi truy vấn DB
    if (!email || !password) {
      console.log('Lỗi: Thiếu email hoặc mật khẩu trong yêu cầu.');
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu.' });
    }

    const user = await User.findOne({ email });
    // Thêm console.log để kiểm tra xem người dùng có được tìm thấy không
    if (!user) {
      console.log('Đăng nhập thất bại: Không tìm thấy người dùng với email:', email);
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }
    console.log('Người dùng được tìm thấy:', user.email);


    const isMatch = await bcrypt.compare(password, user.password);
    // Thêm console.log để kiểm tra kết quả so sánh mật khẩu
    if (!isMatch) {
      console.log('Đăng nhập thất bại: Mật khẩu không khớp cho email:', email);
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }
    console.log('Mật khẩu khớp cho người dùng:', user.email);


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log('JWT Token được tạo thành công cho người dùng:', user.email);


    res.json({ token, role: user.role });

  } catch (err) {
    // console.error chi tiết lỗi server
    console.error('Lỗi khi đăng nhập (backend):', err.message, err.stack);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
});

module.exports = router;