const Province = require('../models/Province'); // Đảm bảo bạn có model này
const Commune = require('../models/Commune');   // Đảm bảo bạn có model này

// Lấy tất cả tỉnh
exports.getAllProvinces = async (req, res) => {
    try {
        const provinces = await Province.find().sort({ name: 1 });
        res.json(provinces);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// Lấy xã theo mã tỉnh
exports.getCommunesByProvince = async (req, res) => {
    const { provinceCode } = req.query;
    if (!provinceCode) {
        return res.status(400).json({ message: 'Thiếu mã tỉnh' });
    }
    try {
        const communes = await Commune.find({ province_code: provinceCode }).sort({ name: 1 });
        res.json(communes);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
