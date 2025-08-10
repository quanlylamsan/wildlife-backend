// controllers/woodActivityController.js
const mongoose = require('mongoose');
const WoodActivity = require('../models/WoodActivity');
const Wood = require('../models/Wood');

// @desc    Tạo bản ghi hoạt động gỗ mới
// @route   POST /api/wood-activities
exports.createWoodActivity = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
    }

    try {
        let { wood, speciesName, date, type, quantity, unit, reason, source, destination, verifiedBy } = req.body;

        // Nếu wood là object thì lấy _id
        const woodId = typeof wood === 'object' ? wood._id : wood;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(woodId)) {
            return res.status(400).json({ message: 'ID gỗ không hợp lệ.' });
        }

        // Kiểm tra gỗ tồn tại
        const existingWood = await Wood.findById(woodId);
        if (!existingWood) {
            return res.status(404).json({ message: 'Không tìm thấy mục gỗ này.' });
        }

        // Tạo bản ghi mới
        const newWoodActivity = new WoodActivity({
            wood: woodId,
            speciesName,
            date,
            type,
            quantity,
            unit,
            reason,
            source,
            destination,
            verifiedBy
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
};

// @desc    Lấy toàn bộ bản ghi hoạt động cho một mục gỗ cụ thể
// @route   GET /api/wood-activities/:woodId
exports.getWoodActivitiesByWoodId = async (req, res) => {
    try {
        const woodActivities = await WoodActivity.find({ wood: req.params.woodId }).sort({ date: 1 });
        res.json(woodActivities);
    } catch (err) {
        console.error(`GET /api/wood-activities/${req.params.woodId} error:`, err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'ID gỗ không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách bản ghi', error: err.message });
    }
};

// @desc    Lấy một bản ghi hoạt động gỗ bằng ID
// @route   GET /api/wood-activities/detail/:id
exports.getWoodActivityById = async (req, res) => {
    try {
        const activity = await WoodActivity.findById(req.params.id);
        if (!activity) {
            return res.status(404).json({ message: 'Không tìm thấy bản ghi hoạt động' });
        }
        res.json(activity);
    } catch (err) {
        console.error(`GET /api/wood-activities/detail/${req.params.id} error:`, err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'ID bản ghi không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi server khi lấy thông tin bản ghi', error: err.message });
    }
};

// @desc    Cập nhật một bản ghi hoạt động gỗ
// @route   PUT /api/wood-activities/:id
exports.updateWoodActivity = async (req, res) => {
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
            return res.status(404).json({ message: 'Không tìm thấy bản ghi để cập nhật' });
        }
        res.json(updatedActivity);
    } catch (err) {
        console.error(`PUT /api/wood-activities/${req.params.id} error:`, err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Lỗi dữ liệu đầu vào', errors: err.errors });
        }
        res.status(500).json({ message: 'Lỗi server khi cập nhật bản ghi', error: err.message });
    }
};

// @desc    Xóa một bản ghi hoạt động gỗ
// @route   DELETE /api/wood-activities/:id
exports.deleteWoodActivity = async (req, res) => {
    try {
        const deletedActivity = await WoodActivity.findByIdAndDelete(req.params.id);
        if (!deletedActivity) {
            return res.status(404).json({ message: 'Không tìm thấy bản ghi để xóa' });
        }
        res.json({ message: 'Xóa bản ghi thành công' });
    } catch (err) {
        console.error(`DELETE /api/wood-activities/${req.params.id} error:`, err);
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'ID bản ghi không hợp lệ.' });
        }
        res.status(500).json({ message: 'Lỗi server khi xóa bản ghi', error: err.message });
    }
};
