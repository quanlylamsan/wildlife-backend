// Ví dụ trong file: /routes/provinceRoutes.js (bạn có thể cần tạo file này)

const express = require('express');
const router = express.Router();
// Giả sử bạn có model để truy vấn DB
const Province = require('../models/provinceModel'); 
const Commune = require('../models/communeModel');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware xác thực token

// API 1: Lấy tất cả tỉnh/thành phố
// Endpoint: GET /api/provinces
router.get('/provinces', authMiddleware, async (req, res) => {
    try {
        // Truy vấn CSDL để lấy danh sách tỉnh
        // Kết quả trả về cần có dạng: [{ code: 'DTH', name: 'Đồng Tháp' }, ...]
        const provinces = await Province.find({}, 'code name -_id'); // Lấy trường code và name, bỏ _id
        res.json(provinces);
    } catch (error) {
        res.status(500).send('Lỗi máy chủ khi lấy danh sách tỉnh');
    }
});

// API 2: Lấy tất cả xã/phường
// Endpoint: GET /api/communes
router.get('/communes', authMiddleware, async (req, res) => {
    try {
        // Truy vấn CSDL để lấy danh sách xã
        // Kết quả trả về cần có dạng: [{ code: '82100', name: 'Phường Thanh Hòa' }, ...]
        const communes = await Commune.find({}, 'code name -_id'); // Lấy trường code và name, bỏ _id
        res.json(communes);
    } catch (error) {
        res.status(500).send('Lỗi máy chủ khi lấy danh sách xã');
    }
});

module.exports = router;

// Đừng quên import và sử dụng router này trong file chính của server (vd: app.js)
// Ví dụ trong app.js:
// const provinceRoutes = require('./routes/provinceRoutes');
// app.use('/api', provinceRoutes);