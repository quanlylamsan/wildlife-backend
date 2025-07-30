// controllers/customerController.js
const Customer = require('../models/customerModel');
const User = require('../models/userModel');

// ✅ Lấy danh sách khách hàng
exports.getCustomers = async (req, res) => {
  try {
    let customers;

    if (req.user.role === 'admin' || req.user.role === 'manager') {
      customers = await Customer.find().populate('createdBy', 'name email');
    } else {
      customers = await Customer.find({ createdBy: req.user._id }).populate('createdBy', 'name email');
    }

    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error: error.message });
  }
};

// ✅ Tạo khách hàng mới
exports.createCustomer = async (req, res) => {
  try {
    const { name, address, province, commune, createdBy } = req.body;

    let createdById;

    if (req.user.role === 'admin' || req.user.role === 'manager') {
      // Nếu admin/manager chỉ định nhân viên
      createdById = createdBy || req.user._id;
    } else {
      // Nếu là staff → tự gán chính mình
      createdById = req.user._id;
    }

    const newCustomer = await Customer.create({
      name,
      address,
      province,
      commune,
      createdBy: createdById,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo khách hàng', error: error.message });
  }
};
