const mongoose = require('mongoose');

const NotebookLMSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, default: '#2ecc71' },
  url: { type: String, required: true },
  categoryGroup: { type: String, default: 'Kiểm lâm' } // Dùng để phân loại nếu cần
}, { timestamps: true });

module.exports = mongoose.model('NotebookLM', NotebookLMSchema);