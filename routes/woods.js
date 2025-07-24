// backend/routes/woods.js
const express = require('express');
const router = express.Router();
const Wood = require('../models/Wood'); // Đảm bảo bạn đã có model Wood
const { verifyToken } = require('../middleware/authMiddleware'); // Middleware xác thực

// Route để lấy chi tiết một mục gỗ bằng ID
router.get('/:id', verifyToken, async (req, res) => { // Endpoint sẽ là /api/woods/:id
  try {
    const woodItem = await Wood.findById(req.params.id);
    if (!woodItem) {
      return res.status(404).json({ message: 'Không tìm thấy mục gỗ.' });
    }
    res.json(woodItem);
  } catch (err) {
    console.error('GET /api/woods/:id error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID gỗ không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết gỗ.', error: err.message });
  }
});

// Bạn có thể thêm các route khác cho Wood (POST, PUT, DELETE) nếu cần
// ...

module.exports = router;