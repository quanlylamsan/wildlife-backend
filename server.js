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

dotenv.config();

const app = express();

// --- BẮT ĐẦU PHẦN CẤU HÌNH CORS CHI TIẾT ---
// Tạo đối tượng cấu hình CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Chỉ cho phép request từ địa chỉ của ứng dụng React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP cho phép
  allowedHeaders: ['Content-Type', 'Authorization'] // Quan trọng: Cho phép các header này
};

// Sử dụng CORS middleware với cấu hình đã tạo
app.use(cors(corsOptions));
// Bật pre-flight cho tất cả các route
app.options('*', cors(corsOptions));
// --- KẾT THÚC PHẦN CẤU HÌNH CORS ---


// Middleware khác
app.use(express.json()); // Cho phép Express đọc JSON từ body của request

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sử dụng các routes (đặt sau middleware)
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmsRoutes);
app.use('/api/farm-activities', farmActivitiesRoutes);
app.use('/api/wood-activities', woodActivitiesRoutes);
app.use('/api/master-product-list', masterListRoutes);

// Định nghĩa cổng server
const PORT = process.env.PORT || 10000;

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});