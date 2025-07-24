// backend/routes/woodActivities.js
const express = require('express');
const router = express.Router();
const WoodActivity = require('../models/WoodActivity'); // Import WoodActivity Model
const Wood = require('../models/Wood'); // Import Wood Model (giả sử bạn có)
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // Middleware xác thực

// ➕ Tạo bản ghi hoạt động gỗ mới
router.post('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') { // Hoặc vai trò phù hợp
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  }

  try {
    const { farm, speciesName, date, type, quantity, unit, reason, source, destination, verifiedBy } = req.body;

    // Kiểm tra xem ID gỗ có tồn tại không (nếu có model Wood)
    const existingWood = await Wood.findById(farm);
    if (!existingWood) {
        return res.status(404).json({ message: 'Không tìm thấy mục gỗ này.' });
    }

    const newWoodActivity = new WoodActivity({
     wood: farm, speciesName, date, type, quantity, unit, reason, source, destination, verifiedBy
});

    const savedActivity = await newWoodActivity.save();
    res.status(201).json(savedActivity);
  } catch (err) {
    console.error('POST /api/wood-activities error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Lỗi dữ liệu đầu vào', errors: err.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo bản ghi hoạt động gỗ', error: err.message });
  }
});

// 🔎 Lấy toàn bộ bản ghi hoạt động gỗ cho một mục gỗ cụ thể
router.get('/:farmId', verifyToken, async (req, res) => {
  try {
    const woodActivities = await WoodActivity.find({ wood: req.params.farmId }).sort({ date: 1 });
    res.json(woodActivities);
  } catch (err) {
    console.error('GET /api/wood-activities/:farmId error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID gỗ không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách bản ghi hoạt động gỗ', error: err.message });
  }
});

// 🔎 Lấy một bản ghi hoạt động gỗ bằng ID
router.get('/detail/:id', verifyToken, async (req, res) => {
  try {
    const activity = await WoodActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi hoạt động gỗ' });
    }
    res.json(activity);
  } catch (err) {
    console.error('GET /api/wood-activities/detail/:id error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID bản ghi hoạt động gỗ không hợp lệ.' });
    }
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin bản ghi hoạt động gỗ', error: err.message });
  }
});

// ✏️ Cập nhật một bản ghi hoạt động gỗ
router.put('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff') {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  }
  try {
    const updatedActivity = await WoodActivity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedActivity) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi hoạt động gỗ để cập nhật' });
    }
    res.json(updatedActivity);
  } catch (err) {
    console.error('PUT /api/wood-activities/:id error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Lỗi dữ liệu đầu vào', errors: err.errors });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật bản ghi hoạt động gỗ', error: err.message });
  }
});

// ❌ Xóa một bản ghi hoạt động gỗ
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
  }
  try {
    const deletedActivity = await WoodActivity.findByIdAndDelete(req.params.id);
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Không tìm thấy bản ghi hoạt động gỗ để xóa' });
    }
    res.json({ message: 'Xóa bản ghi hoạt động gỗ thành công' });
  } catch (err) {
      console.error('DELETE /api/wood-activities/:id error:', err);
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'ID bản ghi hoạt động gỗ không hợp lệ.' });
      }
      res.status(500).json({ message: 'Lỗi server khi xóa bản ghi hoạt động gỗ', error: err.message });
  }
});

module.exports = router;