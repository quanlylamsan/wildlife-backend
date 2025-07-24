// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // ✅ Import verifyToken và isAdmin

// Example: Get all users (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => { // ✅ Sử dụng verifyToken và isAdmin như các middleware
  try {
    const users = await User.find().select('-password'); // Don't return passwords
    res.json(users);
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng', error: err.message });
  }
});

// Example: Create a new user (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => { // ✅ Sử dụng verifyToken và isAdmin
  try {
    const { email, password, role } = req.body;
    const newUser = new User({ email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'Người dùng đã được tạo thành công!' });
  } catch (err) {
    console.error('POST /api/users error:', err);
    if (err.code === 11000) { // Duplicate key error (e.g., email already exists)
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo người dùng', error: err.message });
  }
});

// Example: Get a user by ID (admin only)
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }
    res.json(user);
  } catch (err) {
    console.error('GET /api/users/:id error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin người dùng', error: err.message });
  }
});

// Example: Update a user by ID (admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật' });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error('PUT /api/users/:id error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Lỗi dữ liệu đầu vào', errors: err.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật người dùng', error: err.message });
  }
});

// Example: Delete a user by ID (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });
    }
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (err) {
    console.error('DELETE /api/users/:id error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID người dùng không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng', error: err.message });
  }
});


module.exports = router;
