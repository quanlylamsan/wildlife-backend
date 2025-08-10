// File: ./controllers/masterListController.js

const Province = require('../models/Province');
const Commune = require('../models/Commune');

// Hàm lấy tất cả tỉnh
const getAllProvinces = async (req, res) => {
    try {
        // Truy vấn và trả về tất cả các tỉnh
        const provinces = await Province.find({}).select('code name -_id').sort({ name: 1 });
        res.status(200).json(provinces);
    } catch (error) {
        console.error('Lỗi server khi lấy tỉnh:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Hàm lấy tất cả xã
const getAllCommunes = async (req, res) => {
    try {
        // Truy vấn và trả về tất cả các xã
        const communes = await Commune.find({}).select('code name -_id').sort({ name: 1 });
        res.status(200).json(communes);
    } catch (error) {
        console.error('Lỗi server khi lấy xã:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// QUAN TRỌNG: Export đúng tên các hàm
module.exports = {
    getAllProvinces,
    getAllCommunes
};