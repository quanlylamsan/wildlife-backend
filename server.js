const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Đảm bảo đã import

// ... (các import routes khác)

dotenv.config();

const app = express();

// --- CẤU HÌNH CORS TẠM THỜI ĐƠN GIẢN NHẤT (CHỈ ĐỂ KIỂM TRA) ---
app.use(cors()); // ✅ Bỏ qua tất cả corsOptions và cho phép mọi thứ
// app.options('*', cors()); // Không cần dòng này nếu app.use(cors()) đã được gọi trước các route

// --- Middleware để đọc JSON từ body của request ---
app.use(express.json());

// ... (các phần kết nối MongoDB và sử dụng routes khác)

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});