// middleware/canAccessFarm.js
const Farm = require('../models/Farm');

const canAccessFarm = async (req, res, next) => {
  try {
    const user = req.user; // từ verifyToken
    const farmId = req.params.id || req.params.farmId;

    const farm = await Farm.findById(farmId);
    if (!farm) return res.status(404).json({ message: 'Cơ sở không tồn tại.' });

    // Admin luôn được quyền
    if (user.role === 'admin') return next();

    // Nhân viên cấp xã được quyền nếu cùng xã
    if (
      user.role === 'employee' &&
      user.level === 'ward' &&
      user.wards.includes(farm.xaPhuong)
    ) {
      return next();
    }

    // Nhân viên cấp tỉnh (nếu có logic)
    if (
      user.role === 'employee' &&
      user.level === 'province' &&
      user.provinces.includes(farm.tinhThanhPho)
    ) {
      return next();
    }

    return res.status(403).json({ message: 'Không có quyền truy cập cơ sở này.' });
  } catch (err) {
    console.error('Lỗi canAccessFarm:', err);
    res.status(500).json({ message: 'Lỗi phân quyền truy cập cơ sở.' });
  }
};

module.exports = canAccessFarm;
