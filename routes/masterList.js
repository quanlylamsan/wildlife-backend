// File: ./routes/masterList.js

const express = require('express');
const router = express.Router();

// Import controller và middleware
const masterListController = require('../controllers/masterListController');
const { protect } = require('../middleware/authMiddleware');

// Route để lấy tất cả tỉnh
// URL cuối cùng: GET /api/master-product-list/provinces
router.get('/provinces', protect, masterListController.getAllProvinces);

// Route để lấy tất cả xã
// URL cuối cùng: GET /api/master-product-list/communes
router.get('/communes', protect, masterListController.getAllCommunes);

module.exports = router;