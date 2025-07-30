// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCustomers,
  createCustomer
} = require('../controllers/customerController');

const { protect } = require('../middleware/authMiddleware');

// ✅ Các route yêu cầu xác thực
router.route('/')
  .get(protect, getCustomers)     // Lấy danh sách khách hàng
  .post(protect, createCustomer); // Tạo mới khách hàng

module.exports = router;
