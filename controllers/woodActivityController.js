// controllers/woodActivityController.js
const mongoose = require('mongoose');
const WoodActivity = require('../models/WoodActivity');
const Farm = require('../models/Farm'); // thay Wood thành Farm

// @desc    Tạo bản ghi hoạt động gỗ mới
// @route   POST /api/wood-activities
exports.createWoodActivity = async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
    }

    try {
        let { farm, speciesName, date, type, quantity, reason, source, destination, verifiedBy } = req.body;

        // Kiểm tra farmId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(farm)) {
            return res.status(400).json({ message: 'ID cơ sở không hợp lệ.' });
        }

        // Kiểm tra cơ sở tồn tại
        const existingFarm = await Farm.findById(farm);
        if (!existingFarm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở này.' });
        }

        // Tạo bản ghi mới
        const newWoodActivity = new WoodActivity({
            farm,
            speciesName,
            date,
            type,
            quantity,
            reason,
            source,
            destination,
            verifiedBy
        });
		// ⭐⭐ THÊM LOGIC CẬP NHẬT TỒN KHO Ở ĐÂY ⭐⭐
        // ----------------------------------------

        // Tìm sản phẩm gỗ tương ứng trong mảng woodProducts của Farm
        const woodProduct = existingFarm.woodProducts.find(
            p => p.tenLamSan === speciesName
        );

        if (!woodProduct) {
            return res.status(400).json({ message: 'Không tìm thấy sản phẩm lâm sản này trong cơ sở.' });
        }

        // Cập nhật khối lượng tồn kho
        if (type === 'import') {
            woodProduct.khoiLuong += quantity;
        } else if (type === 'export') {
            // Kiểm tra số lượng xuất không vượt quá tồn kho
            if (woodProduct.khoiLuong < quantity) {
                return res.status(400).json({ message: 'Số lượng xuất không được vượt quá tồn kho.' });
            }
            woodProduct.khoiLuong -= quantity;
        }

        // ----------------------------------------
        // ⭐⭐ KẾT THÚC LOGIC CẬP NHẬT TỒN KHO ⭐⭐
        const savedActivity = await newWoodActivity.save();
        await existingFarm.save(); // Lưu Farm đã được cập nhật

        res.status(201).json(savedActivity);

    } catch (err) {
        console.error('POST /api/wood-activities error:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Lỗi dữ liệu đầu vào', errors: err.errors });
        }
        res.status(500).json({ message: 'Lỗi server khi tạo bản ghi hoạt động gỗ', error: err.message });
    }
};

// @desc    Lấy toàn bộ bản ghi hoạt động cho một cơ sở
// @route   GET /api/wood-activities/by-farm/:farmId
exports.getWoodActivitiesByFarmId = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.farmId)) {
            return res.status(400).json({ message: 'ID cơ sở không hợp lệ.' });
        }

        // Tạo đối tượng query ban đầu
        let query = { farm: req.params.farmId };

        // Thêm điều kiện lọc nếu có tham số speciesName từ frontend
        if (req.query.speciesName) {
            query.speciesName = req.query.speciesName;
        }

        // Tìm các bản ghi dựa trên query
        const woodActivities = await WoodActivity.find(query).sort({ date: -1 }); // Sắp xếp theo ngày giảm dần
        res.json(woodActivities);

    } catch (err) {
        console.error(`GET /api/wood-activities/by-farm/${req.params.farmId} error:`, err);
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
