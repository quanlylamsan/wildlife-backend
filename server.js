const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import các routes của bạn
const authRoutes = require('./routes/auth');
const farmsRoutes = require('./routes/farms');
const farmActivitiesRoutes = require('./routes/farmActivities');
const woodActivitiesRoutes = require('./routes/woodActivities');
const masterListRoutes = require('./routes/masterList');

dotenv.config(); // Load biến môi trường từ .env file

const app = express();

// --- BẮT ĐẦU PHẦN CẤU HÌNH CORS CHI TIẾT ---
// Tạo đối tượng cấu hình CORS
const corsOptions = {
  // ✅ Đã cập nhật: Cho phép domain GitHub Pages của frontend
  // Thêm 'http://localhost:3000' hoặc các cổng phát triển cục bộ khác nếu bạn cần
  // chạy frontend cục bộ để kiểm tra với backend này.
  origin: ['https://quanlylamsan.github.io', 'http://localhost:3000'], 
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Các phương thức HTTP cho phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Quan trọng: Cho phép các header này được gửi
  credentials: true // Cho phép gửi cookie/authentication header nếu có (ví dụ: token JWT trong header Authorization)
};

// Sử dụng CORS middleware với cấu hình đã tạo
app.use(cors(corsOptions));
// Bật pre-flight cho tất cả các route (đặc biệt quan trọng cho các request phức tạp như POST, PUT, DELETE, hoặc có custom headers)
app.options('*', cors(corsOptions));
// --- KẾT THÚC PHẦN CẤU HÌNH CORS ---


// Middleware để đọc JSON từ body của request (đặt trước các route sử dụng body)
app.use(express.json());

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sử dụng các routes của API (đặt sau middleware)
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmsRoutes);
app.use('/api/farm-activities', farmActivitiesRoutes);
app.use('/api/wood-activities', woodActivitiesRoutes);
app.use('/api/master-product-list', masterListRoutes);

// Định nghĩa cổng server. Ưu tiên biến môi trường PORT (được Render cung cấp), sau đó là 10000.
const PORT = process.env.PORT || 10000;

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});