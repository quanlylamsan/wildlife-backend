// backend/models/WoodActivity.js
const mongoose = require('mongoose');

const WoodActivitySchema = new mongoose.Schema({
  Farm: { // ID của mục gỗ mà bản ghi này thuộc về
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm', // Tham chiếu đến model Farm
    required: true,
  },
  speciesName: { // Tên loài gỗ
    type: String,
    required: true,
    trim: true,
  },
  date: { // Ngày nhập/xuất
    type: Date,
    required: true,
  },
  type: { // Loại giao dịch: 'import' (nhập), 'export' (xuất)
    type: String,
    enum: ['import', 'export'],
    required: true,
  },
  quantity: { // Số lượng
    type: Number,
    required: true,
    min: 0,
  },
  unit: { // Đơn vị (m3, kg, ...)
    type: String,
    required: true,
    trim: true,
  },
  reason: { // Lý do nhập/xuất
    type: String,
    trim: true,
  },
  source: { // Nguồn gốc (chỉ cho nhập)
    type: String,
    trim: true,
    required: function () {
      return this.type === 'import';
    }
  },
  destination: { // Nơi đến (chỉ cho xuất)
    type: String,
    trim: true,
    required: function () {
      return this.type === 'export';
    }
  },
  verifiedBy: { // Người xác nhận
    type: String,
    trim: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('WoodActivity', WoodActivitySchema);
