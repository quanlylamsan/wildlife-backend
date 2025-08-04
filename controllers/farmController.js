const Farm = require('../models/Farm');

// ==== VALIDATION HỖ TRỢ ====
const validateFarmInput = (data) => {
    const requiredFields = [
        'tenCoSo',
        'tinhThanhPho',
        'xaPhuong',
        'diaChiCoSo',
        'tenNguoiDaiDien',
        'soCCCD',
        'loaiCoSoDangKy',
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        return `Thiếu trường bắt buộc: ${missingFields.join(', ')}`;
    }

    return null;
};

const validateProductInput = (product, loaiCoSoDangKy) => {
    if (!product.tenLamSan || !product.khoiLuong) {
        return 'Tên lâm sản và khối lượng là bắt buộc.';
    }

    if (loaiCoSoDangKy.includes('gỗ')) {
        if (!product.loaiHinhCheBienGo || !product.nguonGocGo) {
            return 'Thiếu thông tin chế biến và nguồn gốc gỗ.';
        }
    } else {
        if (!product.mucDichNuoi || !product.hinhThucNuoi) {
            return 'Thiếu mục đích và hình thức nuôi.';
        }
    }

    return null;
};

// ==== TẠO MỚI CƠ SỞ ====
const createFarm = async (req, res) => {
    try {
        const error = validateFarmInput(req.body);
        if (error) {
            return res.status(400).json({ message: error });
        }

        const newFarm = new Farm(req.body);
        await newFarm.save();
        res.status(201).json(newFarm);
    } catch (error) {
        console.error("Lỗi khi tạo cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== LẤY DANH SÁCH TẤT CẢ CƠ SỞ ====
const getAllFarms = async (req, res) => {
    try {
        const farms = await Farm.find();
        res.status(200).json(farms);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== LẤY CƠ SỞ THEO ID ====
const getFarmById = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }
        res.status(200).json(farm);
    } catch (error) {
        console.error("Lỗi khi lấy cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== CẬP NHẬT CƠ SỞ ====
const updateFarm = async (req, res) => {
    try {
        const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }
        res.status(200).json(farm);
    } catch (error) {
        console.error("Lỗi khi cập nhật cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== XOÁ CƠ SỞ ====
const deleteFarm = async (req, res) => {
    try {
        const farm = await Farm.findByIdAndDelete(req.params.id);
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }
        res.status(200).json({ message: 'Xoá cơ sở thành công.' });
    } catch (error) {
        console.error("Lỗi khi xoá cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== TẠO HÀNG LOẠT CƠ SỞ ====
const bulkCreateFarms = async (req, res) => {
    try {
        const farms = req.body;

        const invalid = farms.find(f => validateFarmInput(f));
        if (invalid) {
            return res.status(400).json({ message: 'Một số bản ghi thiếu thông tin bắt buộc.' });
        }

        const result = await Farm.insertMany(farms);
        res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi khi tạo hàng loạt:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== THÊM LÂM SẢN / LOÀI NUÔI ====
const addProductToFarm = async (req, res) => {
    try {
        const farmId = req.params.id;
        const product = req.body;

        const farm = await Farm.findById(farmId);
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }

        const error = validateProductInput(product, farm.loaiCoSoDangKy);
        if (error) {
            return res.status(400).json({ message: error });
        }

        farm.products.push(product);
        await farm.save();

        res.status(201).json({ message: 'Thêm lâm sản thành công.', product });
    } catch (error) {
        console.error("Lỗi khi thêm lâm sản:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

module.exports = {
    createFarm,
    getAllFarms,
    getFarmById,
    updateFarm,
    deleteFarm,
    bulkCreateFarms,
    addProductToFarm,
};
