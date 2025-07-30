// backend/routes/farmActivities.js
const express = require('express');
const router = express.Router();
const FarmActivity = require('../models/FarmActivity'); // Import FarmActivity Model
const { protect, isAdmin } = require('../middleware/authMiddleware'); // Sửa tên middleware cho đúng

// ➕ Tạo bản ghi theo dõi mới cho một cơ sở gây nuôi
router.post('/', protect, async (req, res) => {
  // Kiểm tra quyền (ví dụ: staff hoặc admin)
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  }

  try {
    const newActivity = new FarmActivity(req.body);
    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (err) {
    console.error('POST /api/farm-activities error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Lỗi dữ liệu đầu vào', errors: err.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo bản ghi theo dõi', error: err.message });
  }
});

// 🔎 Lấy toàn bộ bản ghi theo dõi cho một cơ sở cụ thể
router.get('/:farmId', protect, async (req, res) => { // Lấy farmId từ URL
  try {
    // ✅ Sửa lỗi: Tìm kiếm FarmActivity theo farmId, không phải Farm
    const activities = await FarmActivity.find({ farm: req.params.farmId }).sort({ date: 1 });
    res.json(activities);
  } catch (err) {
    console.error('GET /api/farm-activities/:farmId error:', err);
    if (err.name === 'CastError') { // Xử lý lỗi nếu farmId không hợp lệ
      return res.status(400).json({ message: 'ID cơ sở nuôi không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách bản ghi theo dõi', error: err.message });
  }
});

// 🔎 Lấy một bản ghi theo dõi bằng ID
router.get('/detail/:id', protect, async (req, res) => {
  try {
    const activity = await FarmActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi theo dõi' });
    }
    res.json(activity);
  } catch (err) {
    console.error('GET /api/farm-activities/detail/:id error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID bản ghi theo dõi không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin bản ghi theo dõi', error: err.message });
  }
});

// ✏️ Cập nhật một bản ghi theo dõi (chỉ admin hoặc staff có quyền)
router.put('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  }
  try {
    const updatedActivity = await FarmActivity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi theo dõi để cập nhật' });
    }
    res.json(updatedActivity);
  } catch (err) {
    console.error('PUT /api/farm-activities/:id error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Lỗi dữ liệu đầu vào', errors: err.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật bản ghi theo dõi', error: err.message });
  }
});

// ❌ Xóa một bản ghi theo dõi (chỉ admin)
router.delete('/:id', protect, isAdmin, async (req, res) => { // Dùng isAdmin ở đây
  try {
    const deletedActivity = await FarmActivity.findByIdAndDelete(req.params.id);
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi theo dõi để xóa' });
    }
    res.json({ message: 'Xóa bản ghi theo dõi thành công' });
  } catch (err) {
      console.error('DELETE /api/farm-activities/:id error:', err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'ID bản ghi theo dõi không hợp lệ.' });
      }
      res.status(500).json({ message: 'Lỗi server khi xóa bản ghi theo dõi', error: err.message });
  }
});

module.exports = router;
