const express = require('express');
const router = express.Router();
const NotebookLM = require('../models/NotebookLM');
console.log(">>> Đã load NotebookLM Routes");
// @route   GET /api/notebooklm
// @desc    Lấy danh sách tất cả sổ tay
router.get('/', async (req, res) => {
  try {
    const notebooks = await NotebookLM.find().sort({ id: 1 });
    res.json(notebooks);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi tải dữ liệu sổ tay" });
  }
});

// @route   POST /api/notebooklm/seed
// @desc    Nạp dữ liệu mẫu ban đầu (Chạy 1 lần duy nhất)
router.post('/seed', async (req, res) => {
  const initialData = [
    { id: 1, title: "Công tác tổ chức", icon: "👥🌲", color: "#2ecc71", url: "https://notebooklm.google.com/notebook/565adb27-39a0-4097-99c6-7dbbae1f787e?authuser=3" },
    { id: 2, title: "Thi đua, khen thưởng", icon: "🏆🌿", color: "#27ae60", url: "https://notebooklm.google.com/notebook/fdf4c0a7-f67b-4d29-8a98-993385141e4f?authuser=3" },
    { id: 3, title: "Kế toán", icon: "💰🍃", color: "#00b894", url: "https://notebooklm.google.com/notebook/4352f0dc-ca78-4841-aef0-200c4eafd9c8?authuser=3" },
    { id: 4, title: "Thủ tục hành chính", icon: "📜🌳", color: "#2ecc71", url: "https://notebooklm.google.com/notebook/d2f1ef21-cb8f-4043-aa09-0ad6cc4db617?authuser=3" },
    { id: 5, title: "Quản lý lâm sản", icon: "🌿🪵", color: "#009432", url: "https://notebooklm.google.com/notebook/4199d8bd-648b-4333-a9bf-92bfecfb267b?authuser=3" },
    { id: 6, title: "Phòng cháy chữa cháy", icon: "🔥🚫", color: "#e74c3c", url: "https://notebooklm.google.com/notebook/115ca00a-8d30-467f-a904-02d775d9197d?authuser=3" },
    { id: 7, title: "Xử lý vi phạm", icon: "⚖️👮", color: "#16a085", url: "https://notebooklm.google.com/notebook/c2f883bb-427a-405c-8389-1a384de13bdc?authuser=3" },
    { id: 8, title: "Dịch vụ môi trường rừng", icon: "💧🌲", color: "#00d2d3", url: "https://notebooklm.google.com/notebook/d3966cc7-a41a-4274-b071-f13accf63fd5?authuser=3" },
    { id: 9, title: "Quản lý rừng bền vững", icon: "🌲♾️", color: "#10ac84", url: "https://notebooklm.google.com/notebook/ae0029c5-5607-4f2d-b92f-ec84065ca612?authuser=3" },
    { id: 10, title: "Quy hoạch", icon: "🗺️🎋", color: "#58B19F", url: "https://notebooklm.google.com/notebook/40bd59b0-d9f8-4fe0-95ea-21c4705bd452?authuser=3" },
    { id: 11, title: "Phát triển Lâm nghiệp", icon: "🌱📈", color: "#2ecc71", url: "https://notebooklm.google.com/notebook/5678a9f9-067e-4b8e-9dab-ed4d2234da18?authuser=3" },
    { id: 12, title: "Diễn biến rừng", icon: "📊🛰️", color: "#006266", url: "https://notebooklm.google.com/notebook/71d3ded4-3be3-4d5d-a3f4-c2680a12fba4?authuser=3" },
    { id: 13, title: "Đơn vị quản lý rừng", icon: "🏢🌲", color: "#A3CB38", url: "https://notebooklm.google.com/notebook/4b2df91b-5e96-48fd-90f0-c26028633b80?authuser=3" },
    { id: 14, title: "Tuyên truyền, đấu tranh", icon: "📢🌳", color: "#C4E538", url: "https://notebooklm.google.com/notebook/f4da48a9-3619-46b6-90f6-21db3bacaf56?authuser=3" }
  ];

  try {
    await NotebookLM.deleteMany({}); // Xóa dữ liệu cũ nếu có
    const result = await NotebookLM.insertMany(initialData);
    res.status(201).json({ message: "Đã nạp 14 mục sổ tay thành công", result });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi nạp dữ liệu mẫu", error: err.message });
  }
});

module.exports = router;