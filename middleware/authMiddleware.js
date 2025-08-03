const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Sửa tên model cho nhất quán

/**
 * Middleware để xác thực token và lấy thông tin người dùng
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Lấy token từ header
      token = authHeader.split(' ')[1];
	console.log('SECRET DÙNG ĐỂ KIỂM TRA TOKEN:', process.env.JWT_SECRET);

      // Giải mã token để lấy ID người dùng
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin người dùng đầy đủ từ DB và gắn vào request
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Người dùng không tồn tại' });
      }

      next(); // Cho phép đi tiếp
    } catch (error) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }
  } else {
    return res.status(401).json({ message: 'Chưa đăng nhập hoặc thiếu token' });
  }
};

/**
 * Middleware để kiểm tra vai trò admin
 * Phải được dùng SAU middleware `protect`
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập (yêu cầu quyền Admin)' });
  }
};

/**
 * Middleware để kiểm tra vai trò admin hoặc manager
 * Phải được dùng SAU middleware `protect`
 */
const isAdminOrManager = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập (yêu cầu quyền Admin/Manager)' });
  }
};

module.exports = {
    protect,
    isAdmin,
    isAdminOrManager
};
