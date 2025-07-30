const User = require('../models/User');

// Tạo người dùng mới
const createUser = async (req, res) => {
  try {
    // SỬA LỖI: Đổi tên biến để khớp với dữ liệu từ form (province, communes)
    const { email, password, role, displayName, employeeId, province, communes } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại.' });

    const newUser = new User({
      email,
      password,
      role,
      displayName,
      employeeId,
      province, // Sửa ở đây
      communes  // Sửa ở đây
    });

    await newUser.save();
    // Trả về người dùng mới (không bao gồm mật khẩu)
    const userToReturn = newUser.toObject();
    delete userToReturn.password;
    
    res.status(201).json({ message: 'Tạo người dùng thành công!', user: userToReturn });
  } catch (err) {
    console.error('POST /api/users error:', err);
    res.status(500).json({ message: 'Lỗi tạo người dùng', error: err.message });
  }
};

// Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách', error: err.message });
  }
};

// Lấy người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy người dùng', error: err.message });
  }
};

// Cập nhật người dùng
const updateUser = async (req, res) => {
  try {
    // Không cho phép cập nhật mật khẩu qua route này
    const { password, ...updateData } = req.body;

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!updated) return res.status(404).json({ message: 'Không tìm thấy người dùng để cập nhật' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật', error: err.message });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy người dùng để xoá' });
    res.json({ message: 'Xoá người dùng thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xoá', error: err.message });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
