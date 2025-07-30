const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String },          // 👈 Tên hiển thị
  employeeId: { type: String },           // 👈 Mã nhân viên
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    default: 'staff',
  },
  province: { type: String },             // 👈 Áp dụng cho manager
  communes: [{ type: String }],           // 👈 Áp dụng cho staff (có thể quản nhiều xã)
}, { timestamps: true });

// ✅ Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ So sánh mật khẩu khi đăng nhập
userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
