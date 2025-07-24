const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm'); // Import Farm Model
const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); // Import verifyToken và isAdmin

// ➕ Tạo cơ sở gây nuôi mới (chỉ admin có thể tạo)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { 
      tenCoSo, tinhThanhPho, xaPhuong, diaChiCoSo, 
      tenNguoiDaiDien, soCCCD,
      vido, kinhdo, 
      ngayThanhLap, giayPhepKinhDoanh, ghiChu,
      namSinh, ngayCapCCCD, noiCapCCCD, 
      soDienThoaiNguoiDaiDien, diaChiNguoiDaiDien, 
      mucDichNuoi, hinhThucNuoi, maSoCoSoGayNuoi, tongDan, 
      loaiHinhKinhDoanhGo, nganhNgheKinhDoanhGo, khoiLuong,
      loaiCoSoDangKy,
      tenLamSan, tenKhoaHoc,
      issueDate, expiryDate,
      trangThai,
      loaiHinhCheBienGo,
      nguonGocGo
    } = req.body;

    const existingFarm = await Farm.findOne({
      tenCoSo: tenCoSo,
      tinhThanhPho: tinhThanhPho,
      xaPhuong: xaPhuong,
      diaChiCoSo: diaChiCoSo,
      tenNguoiDaiDien: tenNguoiDaiDien,
      soCCCD: soCCCD
    });

    if (existingFarm) {
      return res.status(409).json({
        message: 'Cơ sở với các thông tin chính đã tồn tại.',
        farmId: existingFarm._id
      });
    }

    const newFarm = new Farm(req.body);
    const savedFarm = await newFarm.save();
    res.status(201).json(savedFarm);
  } catch (err) {
    console.error('Lỗi khi tạo cơ sở mới:', err);
    if (err.name === 'ValidationError') {
      let errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ message: 'Lỗi xác thực dữ liệu', errors });
    }
    res.status(500).json({ message: 'Lỗi server nội bộ khi tạo cơ sở mới.' });
  }
});


// Route để tải lên hàng loạt (BULK UPLOAD)
router.post('/bulk', verifyToken, isAdmin, async (req, res) => {
  const farmsData = req.body;
  const savedFarms = [];
  const errors = [];

  if (!Array.isArray(farmsData) || farmsData.length === 0) {
    return res.status(400).json({ message: 'Không có dữ liệu hợp lệ để tải lên.' });
  }

  for (const [index, farmData] of farmsData.entries()) {
    try {
      const existingFarm = await Farm.findOne({
        tenCoSo: farmData.tenCoSo,
        tinhThanhPho: farmData.tinhThanhPho,
        xaPhuong: farmData.xaPhuong,
        diaChiCoSo: farmData.diaChiCoSo,
        tenNguoiDaiDien: farmData.tenNguoiDaiDien,
        soCCCD: farmData.soCCCD
      });

      if (existingFarm) {
        errors.push({
          index: index,
          type: 'duplicate',
          message: `Cơ sở '${farmData.tenCoSo}' đã tồn tại.`,
          farmId: existingFarm._id
        });
        continue;
      }

      const newFarm = new Farm(farmData);
      const savedFarm = await newFarm.save();
      savedFarms.push(savedFarm);

    } catch (err) {
      errors.push({
        index: index,
        type: 'validation',
        message: err.message
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Có lỗi xảy ra trong quá trình tải lên hàng loạt.',
      savedCount: savedFarms.length,
      errors: errors
    });
  }

  res.status(201).json({
    message: `Tải lên thành công ${savedFarms.length} cơ sở.`,
    savedFarms: savedFarms
  });
});

// Lấy danh sách cơ sở có phân trang và bộ lọc
router.get('/', verifyToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 15, 
      farmType, 
      trangThai,
      tinhThanhPho,
      xaPhuong,
      nganhNgheKinhDoanhGo,
      loaiHinhCheBienGo,
      nguonGocGo,
      search
    } = req.query;

    const query = {};

    if (farmType) query.loaiCoSoDangKy = farmType;
    if (trangThai) query.trangThai = trangThai;
    if (tinhThanhPho) query.tinhThanhPho = tinhThanhPho;
    if (xaPhuong) query.xaPhuong = xaPhuong;
    if (nganhNgheKinhDoanhGo) query.nganhNgheKinhDoanhGo = nganhNgheKinhDoanhGo;
    if (loaiHinhCheBienGo) query.loaiHinhCheBienGo = loaiHinhCheBienGo;
    if (nguonGocGo) query.nguonGocGo = nguonGocGo;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { tenCoSo: searchRegex },
        { diaChiCoSo: searchRegex },
        { tenNguoiDaiDien: searchRegex },
        { soCCCD: searchRegex },
        { 'products.tenLamSan': searchRegex }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    
    const farms = await Farm.find(query)
                            .sort({ createdAt: -1 })
                            .skip(skip)
                            .limit(parseInt(limit, 10));
    
    const totalDocs = await Farm.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / parseInt(limit, 10));

    res.status(200).json({
      docs: farms,
      totalDocs,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      totalPages,
    });

  } catch (err) {
    console.error('Lỗi khi lấy danh sách cơ sở:', err);
    res.status(500).json({ message: 'Lỗi server nội bộ khi lấy danh sách cơ sở.' });
  }
});

// 🔍 Lấy một cơ sở theo ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
    }
    res.status(200).json(farm);
  } catch (err) {
    console.error('Lỗi khi lấy cơ sở theo ID:', err);
    res.status(500).json({ message: 'Lỗi server nội bộ.' });
  }
});

// ➕ Thêm một lâm sản mới vào một cơ sở đã có (chỉ admin)
router.post('/:farmId/products', verifyToken, isAdmin, async (req, res) => {
  try {
    const { farmId } = req.params;
    const farm = await Farm.findById(farmId);

    if (!farm) {
      return res.status(404).json({ message: 'Không tìm thấy cơ sở để thêm lâm sản.' });
    }

    // *** SỬA LỖI: Kiểm tra và khởi tạo mảng products nếu nó không tồn tại ***
    if (!farm.products) {
        farm.products = [];
    }

    // Thêm đối tượng lâm sản mới vào mảng 'products' của cơ sở
    farm.products.push(req.body);

    const updatedFarm = await farm.save();

    res.status(201).json(updatedFarm);

  } catch (err) {
    console.error('Lỗi khi thêm lâm sản vào cơ sở:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dữ liệu lâm sản không hợp lệ.', errors: err.errors });
    }
    res.status(500).json({ message: 'Lỗi server nội bộ khi thêm lâm sản.' });
  }
});


// ✏️ Cập nhật một cơ sở (chỉ admin có thể cập nhật)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedFarm) {
      return res.status(404).json({ message: 'Không tìm thấy cơ sở để cập nhật.' });
    }
    res.status(200).json(updatedFarm);
  } catch (err) {
    console.error('Lỗi khi cập nhật cơ sở:', err);
    if (err.name === 'ValidationError') {
      let errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ message: 'Lỗi xác thực dữ liệu', errors });
    }
    res.status(500).json({ message: 'Lỗi server nội bộ khi cập nhật cơ sở.' });
  }
});

// 🗑️ Xóa một cơ sở (chỉ admin có thể xóa)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedFarm = await Farm.findByIdAndDelete(req.params.id);
    if (!deletedFarm) {
      return res.status(404).json({ message: 'Không tìm thấy cơ sở để xóa.' });
    }
    res.status(200).json({ message: 'Cơ sở đã được xóa thành công.' });
  } catch (err) {
    console.error('Lỗi khi xóa cơ sở:', err);
    res.status(500).json({ message: 'Lỗi server nội bộ khi xóa cơ sở.' });
  }
});

module.exports = router;