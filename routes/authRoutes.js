// backend/routes/auth.js

const express = require('express');
console.log("--- ROUTER AUTH.JS ĐÃ ĐƯỢC TẢI ---");
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// === BƯỚC 1: IMPORT MIDDLEWARE ===
// Import hàm `protect` từ file middleware của bạn
const { protect } = require('../middleware/authMiddleware');


// === BƯỚC 2: THÊM ROUTE /me ===
// Route này sẽ xử lý yêu cầu `GET /api/auth/me` từ frontend
router.get('/me', protect, (req, res) => {
  // Middleware 'protect' đã làm hết việc nặng:
  // 1. Xác thực token.
  // 2. Lấy thông tin user mới nhất từ DB và gắn vào `req.user`.
  // Giờ chỉ cần gửi thông tin `req.user` đó về cho client.
  res.json(req.user);
});


// === PHẦN CÒN LẠI: GIỮ NGUYÊN ROUTE /login ===
// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Yêu cầu đăng nhập nhận được. Email:', email);
    try {
        if (!email || !password) {
            console.log('Lỗi: Thiếu email hoặc mật khẩu trong yêu cầu.');
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Đăng nhập thất bại: Không tìm thấy người dùng với email:', email);
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }
        console.log('Người dùng được tìm thấy:', user.email);
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Đăng nhập thất bại: Mật khẩu không khớp cho email:', email);
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }
        console.log('Mật khẩu khớp cho người dùng:', user.email);
       console.log('SECRET DÙNG ĐỂ TẠO TOKEN:', process.env.JWT_SECRET);
	   const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('JWT Token được tạo thành công cho người dùng:', user.email);
        res.json({ token, role: user.role });
    } catch (err) {
        console.error('Lỗi khi đăng nhập (backend):', err.message, err.stack);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
});

module.exports = router;