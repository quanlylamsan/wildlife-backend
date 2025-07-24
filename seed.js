const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Cần đúng đường dẫn đến model
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('⚠️ User admin@example.com đã tồn tại.');
      return mongoose.disconnect();
    }

    const hashed = await bcrypt.hash('123456', 10);
    await User.create({
      email: 'admin@example.com',
      password: hashed,
      role: 'admin',
    });

    console.log('✅ Tạo user admin@example.com / 123456 thành công');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });
