// backend/models/WoodActivity.js
const mongoose = require('mongoose');

const WoodActivitySchema = new mongoose.Schema({
  farm: { // ID của cơ sở mà bản ghi này thuộc về
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
    trim: true,
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
  }, // <-- Dấu đóng ngoặc tròn ')' bị thiếu ở đây
  verifiedBy: { // Người xác nhận
    type: String,
    trim: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('WoodActivity', WoodActivitySchema);