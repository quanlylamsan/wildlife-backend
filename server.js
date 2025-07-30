const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Import các file routes
const authRoutes = require('./routes/auth');
const farmsRoutes = require('./routes/farms');
const farmActivitiesRoutes = require('./routes/farmActivities');
const woodActivitiesRoutes = require('./routes/woodActivities');
const masterListRoutes = require('./routes/masterList'); // Route cho tỉnh/xã
const userRoutes = require('./routes/users');           // Route cho người dùng

const corsOptions = {
  origin: ['https://quanlylamsan.github.io', 'http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Gắn các routes vào các đường dẫn API tương ứng
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmsRoutes);
app.use('/api/farm-activities', farmActivitiesRoutes);
app.use('/api/wood-activities', woodActivitiesRoutes);
app.use('/api/master-product-list', masterListRoutes); // API tỉnh/xã sẽ nằm ở đây
app.use('/api/users', userRoutes);                   // API người dùng sẽ nằm ở đây

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Dòng này đã được xóa vì nó gây ra lỗi cú pháp
