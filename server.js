const express = require('express');
console.log("--- SERVER.JS ĐANG CHẠY - PHIÊN BẢN KIỂM TRA ---");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Import các file routes

const authRoutes = require('./routes/authRoutes');
const farmsRoutes = require('./routes/farms');
const farmActivitiesRoutes = require('./routes/farmActivities');
const woodActivitiesRoutes = require('./routes/woodActivities');
const masterListRoutes = require('./routes/masterList'); // Route cho tỉnh/xã
const userRoutes = require('./routes/users');           // Route cho người dùng
const masterAnimalListRoutes = require('./routes/masterAnimalList');
const animalRoutes = require("./routes/animalRoutes"); //Tăng, giảm đàn
const notebooklmRoutes = require("./routes/notebooklmRoutes"); //Sổ tay Ai
const reportRoutes = require('./routes/reportRoutes');

const corsOptions = {
  origin: ['https://quanlylamsan.github.io', 'https://kiemlamdongthap.github.io','http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Gắn các routes vào các đường dẫn API tương ứng
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmsRoutes);
app.use('/api/farm-activities', farmActivitiesRoutes);
app.use('/api/wood-activities', woodActivitiesRoutes);
app.use('/api/master-product-list', masterListRoutes); // API tỉnh/xã sẽ nằm ở đây
app.use('/api/master-animal-list', masterAnimalListRoutes);
app.use('/api/users', userRoutes);                   // API người dùng sẽ nằm ở đây
app.use("/api/animals", animalRoutes); //Tăng, giảm đàn
app.use('/api/notebooklm', notebooklmRoutes); //Sổ tay Ai
app.use('/api/reports', reportRoutes); // 2. Gắn vào đường dẫn /api/reports

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Dòng này đã được xóa vì nó gây ra lỗi cú pháp
