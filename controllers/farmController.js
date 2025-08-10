const Farm = require('../models/Farm');

// =============================================
// SECTION: HÀM HỖ TRỢ & VALIDATION
// =============================================

const parseDateOrNull = (value) => {
    if (!value || String(value).trim() === '') return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
};

const validateFarmInput = (data) => {
    const requiredFields = {
        tenCoSo: 'Tên cơ sở',
        diaChiCoSo: 'Địa chỉ cơ sở',
        vido: "Vĩ độ",
        kinhdo: "Kinh độ",
        tenNguoiDaiDien: 'Họ và Tên người đại diện',
        namSinh: "Năm sinh",
        soCCCD: 'Số CCCD/Hộ chiếu',
        ngayCapCCCD: "Ngày cấp CCCD",
        noiCapCCCD: "Nơi cấp CCCD",
        soDienThoaiNguoiDaiDien: "Số điện thoại",
        loaiCoSoDangKy: 'Loại hình đăng ký',
    };

    for (const field in requiredFields) {
        if (!data[field] || String(data[field]).trim() === '') {
            return `Thiếu trường bắt buộc: ${requiredFields[field]} (${field}).`;
        }
    }
    return null;
};

// =============================================
// SECTION: CÁC HÀM XỬ LÝ (CRUD CONTROLLERS)
// =============================================

/**
 * 1. TẠO CƠ SỞ MỚI
 */
exports.createFarm = async (req, res) => {
    try {
        const validationError = validateFarmInput(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const farmData = {
            ...req.body,
            ngayThanhLap: parseDateOrNull(req.body.ngayThanhLap),
            ngayCapCCCD: parseDateOrNull(req.body.ngayCapCCCD),
            issueDate: parseDateOrNull(req.body.issueDate),
            expiryDate: parseDateOrNull(req.body.expiryDate),
        };

        const newFarm = new Farm(farmData);
        await newFarm.save();

        res.status(201).json(newFarm);
    } catch (error) {
        console.error("Lỗi khi tạo cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ khi tạo cơ sở.', error: error.message });
    }
};

/**
 * 2. LẤY TẤT CẢ CÁC CƠ SỞ
 */
exports.getAllFarms = async (req, res) => {
    try {
        // SỬA LỖI: Thêm .populate() để lấy chi tiết sản phẩm và .sort() để sắp xếp
        const farms = await Farm.find({})
            .populate('woodProducts')
            .populate('animalProducts')
            .sort({ createdAt: -1 });

        res.status(200).json(farms);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách:", error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách.', error: error.message });
    }
};

/**
 * 3. LẤY MỘT CƠ SỞ THEO ID
 */
exports.getFarmById = async (req, res) => {
    try {
        // SỬA LỖI: Thêm .populate() để khi xem chi tiết cũng thấy đầy đủ sản phẩm
        const farm = await Farm.findById(req.params.id)
            .populate('woodProducts')
            .populate('animalProducts');

        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }
        res.status(200).json(farm);
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ khi lấy chi tiết.', error: error.message });
    }
};

/**
 * 4. CẬP NHẬT CƠ SỞ
 */
exports.updateFarm = async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            ngayThanhLap: parseDateOrNull(req.body.ngayThanhLap),
            ngayCapCCCD: parseDateOrNull(req.body.ngayCapCCCD),
            issueDate: parseDateOrNull(req.body.issueDate),
            expiryDate: parseDateOrNull(req.body.expiryDate),
        };

        const farm = await Farm.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở để cập nhật.' });
        }
        res.status(200).json(farm);
    } catch (error) {
        console.error("Lỗi khi cập nhật:", error);
        res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật.', error: error.message });
    }
};

/**
 * 5. XÓA CƠ SỞ
 */
exports.deleteFarm = async (req, res) => {
    try {
        const farm = await Farm.findByIdAndDelete(req.params.id);
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở để xóa.' });
        }
        res.status(200).json({ message: 'Xóa thành công.' });
    } catch (error) {
        console.error("Lỗi khi xóa:", error);
        res.status(500).json({ message: 'Lỗi máy chủ khi xóa.', error: error.message });
    }
};

/**
 * 6. TẠO HÀNG LOẠT
 */
exports.bulkCreateFarms = async (req, res) => {
    try {
        const farmsData = (req.body || []).map(f => ({
            ...f,
            ngayThanhLap: parseDateOrNull(f.ngayThanhLap),
            ngayCapCCCD: parseDateOrNull(f.ngayCapCCCD),
            issueDate: parseDateOrNull(f.issueDate),
            expiryDate: parseDateOrNull(f.expiryDate),
        }));

        for (const farm of farmsData) {
            const validationError = validateFarmInput(farm);
            if (validationError) {
                return res.status(400).json({ message: `Lỗi dữ liệu hàng loạt: ${validationError}` });
            }
        }
        const result = await Farm.insertMany(farmsData);
        res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi khi tạo hàng loạt:", error);
        res.status(500).json({ message: 'Lỗi máy chủ khi tạo hàng loạt.', error: error.message });
    }
};

/**
 * 7. THÊM SẢN PHẨM GỖ VÀO CƠ SỞ
 */
exports.addWoodProductToFarm = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }
        farm.woodProducts.push(req.body);
        await farm.save();
        res.status(201).json(farm);
    } catch (err) {
        console.error("Lỗi khi thêm sản phẩm gỗ:", err);
        res.status(500).json({ message: 'Lỗi máy chủ khi thêm sản phẩm gỗ.', error: err.message });
    }
};

/**
 * 8. THÊM SẢN PHẨM ĐỘNG VẬT VÀO CƠ SỞ
 */
exports.addAnimalProductToFarm = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }
        farm.animalProducts.push(req.body);
        await farm.save();
        res.status(201).json(farm);
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm động vật:', error);
        res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm động vật.', error: error.message });
    }
};