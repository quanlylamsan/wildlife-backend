// backend/models/FarmActivity.js
const mongoose = require('mongoose');

const FarmActivitySchema = new mongoose.Schema({
  farm: { // ID của cơ sở gây nuôi mà bản ghi này thuộc về
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm', // Tham chiếu đến model Farm
    required: true,
  },
  speciesName: { // Tên loài được theo dõi trong bản ghi này
    type: String,
    required: true,
    trim: true,
  },
  date: { // Ngày ghi nhận bản ghi
    type: Date,
    required: true,
  },
  totalIndividuals: { // Tổng số cá thể tại thời điểm ghi nhận
    type: Number,
    required: true,
    min: 0,
  },
  currentStatus: { // Hiện trạng nuôi
    parents: { // Bố mẹ
      male: { type: Number, default: 0, min: 0 }, // Đực
      female: { type: Number, default: 0, min: 0 }, // Cái
      // Không có 'unidentified' cho parents theo mẫu mới
    },
    otherIndividuals: { // Cá thể khác
      male: { type: Number, default: 0, min: 0 }, // Đực
      female: { type: Number, default: 0, min: 0 }, // Cái
      unidentified: { type: Number, default: 0, min: 0 }, // Không rõ
    },
  },
  increase: { // Tăng đàn
    parents: {
      male: { type: Number, default: 0, min: 0 },
      female: { type: Number, default: 0, min: 0 },
    },
    otherIndividuals: {
      male: { type: Number, default: 0, min: 0 },
      female: { type: Number, default: 0, min: 0 },
      unidentified: { type: Number, default: 0, min: 0 },
    },
  },
  decrease: { // Giảm đàn
    parents: {
      male: { type: Number, default: 0, min: 0 },
      female: { type: Number, default: 0, min: 0 },
    },
    otherIndividuals: {
      male: { type: Number, default: 0, min: 0 },
      female: { type: Number, default: 0, min: 0 },
      unidentified: { type: Number, default: 0, min: 0 },
    },
  },
  reasonForChange: { // Nguyên nhân biến động (tăng/giảm)
    type: String,
    trim: true,
  },
  verifiedBy: { // Người xác nhận bản ghi
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('FarmActivity', FarmActivitySchema);
