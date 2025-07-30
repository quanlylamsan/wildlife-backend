// models/customerModel.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  province: { type: String, required: true },
  commune: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Nhân viên quản lý
}, {
  timestamps: true,
});

module.exports = mongoose.model('Customer', customerSchema);
