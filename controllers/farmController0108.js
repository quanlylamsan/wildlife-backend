const Farm = require('../models/Farm'); // Đảm bảo bạn đã có model Farm.js

// @desc    Tạo một cơ sở mới
// @route   POST /api/farms
// @access  Private
exports.createFarm = async (req, res) => {
    try {
        const newFarm = new Farm({
            ...req.body,
            owner: req.user.id // Tự động gán người dùng đang đăng nhập làm chủ sở hữu
        });
        const savedFarm = await newFarm.save();
        res.status(201).json(savedFarm);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi tạo cơ sở', error: err.message });
    }
};

// @desc    Lấy danh sách tất cả các cơ sở
// @route   GET /api/farms
// @access  Private
exports.getAllFarms = async (req, res) => {
    try {
        const farms = await Farm.find(); // Có thể thêm bộ lọc dựa trên vai trò người dùng sau này
        res.json(farms);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách cơ sở', error: err.message });
    }
};

// @desc    Lấy thông tin một cơ sở theo ID
// @route   GET /api/farms/:id
// @access  Private
exports.getFarmById = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở' });
        }
        res.json(farm);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin cơ sở', error: err.message });
    }
};

// @desc    Cập nhật thông tin một cơ sở
// @route   PUT /api/farms/:id
// @access  Private (Admin or Manager)
exports.updateFarm = async (req, res) => {
    try {
        const updatedFarm = await Farm.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFarm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở để cập nhật' });
        }
        res.json(updatedFarm);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật cơ sở', error: err.message });
    }
};

// @desc    Xóa một cơ sở
// @route   DELETE /api/farms/:id
// @access  Private (Admin or Manager)
exports.deleteFarm = async (req, res) => {
    try {
        const deletedFarm = await Farm.findByIdAndDelete(req.params.id);
        if (!deletedFarm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở để xoá' });
        }
        res.json({ message: 'Xoá cơ sở thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xoá cơ sở', error: err.message });
    }
};
