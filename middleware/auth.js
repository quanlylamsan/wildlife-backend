// backend/routes/auth.js (hoặc backend/middleware/auth.js)

const express = require('express');
const router = express.Router(); // <--- Dòng này rất quan trọng
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Đảm bảo đường dẫn này đúng tới User model của bạn
const bcrypt = require('bcryptjs'); // Import bcryptjs

// Route Đăng nhập
router.post('/login', async (req, res) => { // <--- Thêm route /login vào router này
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

    res.json({ token, role: user.role });

  } catch (err) {
    console.error('Lỗi khi đăng nhập (backend):', err);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
  }
});

// Middleware xác thực token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Chưa đăng nhập hoặc thiếu token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Verify Token Error:', error);
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
}

// Middleware kiểm tra quyền admin
function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
  }
}

// Export router và các middleware
module.exports = { router, verifyToken, isAdmin }; // <--- QUAN TRỌNG: Phải export 'router'