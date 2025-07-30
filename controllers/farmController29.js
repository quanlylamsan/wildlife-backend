const Farm = require('../models/Farm');

// ✅ Tạo một cơ sở mới
exports.createFarm = async (req, res) => {
    try {
        const userId = req.user.id;
        const newFarm = new Farm({ ...req.body, userId });
        await newFarm.save();
        res.status(201).json(newFarm);
    } catch (error) {
        console.error('Lỗi khi tạo cơ sở:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo cơ sở.', error: error.message });
    }
};

// ✅ Lấy tất cả cơ sở theo user
exports.getAllFarms = async (req, res) => {
    try {
        const farms = await Farm.find({ userId: req.user.id });
        res.status(200).json({ success: true, data: farms });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách cơ sở.', error: error.message });
    }
};

// ✅ Lấy 1 cơ sở theo ID
exports.getFarmById = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);
        if (!farm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        res.status(200).json(farm);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy cơ sở.', error: error.message });
    }
};

// ✅ Cập nhật cơ sở
exports.updateFarm = async (req, res) => {
    try {
        const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFarm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        res.status(200).json(updatedFarm);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật cơ sở.', error: error.message });
    }
};

// ✅ Xoá cơ sở
exports.deleteFarm = async (req, res) => {
    try {
        const deleted = await Farm.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        res.status(200).json({ message: 'Xoá cơ sở thành công.' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xoá cơ sở.', error: error.message });
    }
};

// ✅ Import nhiều cơ sở từ Excel hoặc JSON
exports.importFarmsFromExcel = async (req, res) => {
    const farmsData = req.body.farms;
    const userId = req.user.id;

    if (!Array.isArray(farmsData) || farmsData.length === 0) {
        return res.status(400).json({ message: 'Không có dữ liệu cơ sở nào được cung cấp.' });
    }

    let importedCount = 0;
    let failedCount = 0;
    const errors = [];

    for (const farmData of farmsData) {
        try {
            const newFarm = new Farm({ ...farmData, userId });
            await newFarm.save();
            importedCount++;
        } catch (error) {
            failedCount++;
            const msg = error.code === 11000
                ? `Cơ sở "${farmData.tenCoSo}" đã tồn tại (mã số bị trùng).`
                : `Lỗi khi lưu cơ sở "${farmData.tenCoSo || 'Không rõ'}": ${error.message}`;
            errors.push(msg);
        }
    }

    res.status(200).json({
        message: 'Hoàn tất nhập dữ liệu.',
        importedCount,
        failedCount,
        errors
    });
};

// ✅ (Tuỳ chọn) Thêm loài vật nuôi vào cơ sở
exports.addAnimalToFarm = async (req, res) => {
    const farmId = req.params.id;
    const animal = req.body;

    try {
        const updatedFarm = await Farm.findByIdAndUpdate(
            farmId,
            { $push: { products: animal } },
            { new: true }
        );
        if (!updatedFarm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        res.status(200).json(updatedFarm);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm loài vật.', error: error.message });
    }
};
