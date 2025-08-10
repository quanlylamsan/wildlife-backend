// controllers/farmController.js
const Farm = require('../models/Farm');

/** ==========================
 * HELPER - Parse date safely
 * ========================== */
const parseDateOrNull = (value) => {
  if (!value || String(value).trim() === '') return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

/** ==========================
 * VALIDATION
 * ========================== */
const validateFarmInput = (data) => {
  // Thêm tất cả các trường mà frontend yêu cầu
  const requiredFields = {
    tenCoSo: 'Tên cơ sở',
    diaChiCoSo: 'Địa chỉ cơ sở',
    vido: "Vĩ độ",
    kinhdo: "Kinh độ",
    tenNguoiDaiDien: 'Họ và Tên người đại diện',
    namSinh: "Năm sinh",
    soCCCD: 'Số CCCD/Hộ chiếu',
    ngayCapCCCD: "Ngày cấp CCCD",
    noiCapCCCD: "Nơi cấp CCCD",
    soDienThoaiNguoiDaiDien: "Số điện thoại",
    loaiCoSoDangKy: 'Loại hình đăng ký',
  };

  for (const field in requiredFields) {
    if (!data[field] || String(data[field]).trim() === '') {
      return `Thiếu trường bắt buộc: ${requiredFields[field]} (${field}).`;
    }
  }

  // Kiểm tra Tỉnh/Xã
  if ((!data.province || String(data.province).trim() === '') &&
      (!data.provinceName || String(data.provinceName).trim() === '')) {
    return 'Thiếu thông tin Tỉnh (province hoặc provinceName).';
  }
  if ((!data.commune || String(data.commune).trim() === '') &&
      (!data.communeName || String(data.communeName).trim() === '')) {
    return 'Thiếu thông tin Xã (commune hoặc communeName).';
  }

  // Kiểm tra tính hợp lệ của ngày tháng
  const now = new Date();
  const ngayCap = new Date(data.ngayCapCCCD);
  if (ngayCap > now) {
    return 'Ngày cấp CCCD không được là một ngày trong tương lai.';
  }

  const namSinh = parseInt(data.namSinh, 10);
  const namHienTai = now.getFullYear();
  if (isNaN(namSinh) || namSinh > namHienTai || namSinh < 1900) {
      return 'Năm sinh không hợp lệ.';
  }

  return null; // Trả về null nếu không có lỗi
};

/** ==========================
 * FORMATTERS
 * ========================== */
const normalizeWoodProducts = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map(wp => ({
    tenLamSan: wp.tenLamSan?.trim() || '',
    tenKhoaHoc: wp.tenKhoaHoc?.trim() || '',
    khoiLuong: Number(wp.khoiLuong || 0),
    loaiHinhCheBienGo: wp.loaiHinhCheBienGo || '',
    nguonGocGo: wp.nguonGocGo || ''
  }));
};

const normalizeAnimalProducts = (list) => {
  if (!Array.isArray(list)) return [];
  return list.map(ap => ({
    tenLamSan: ap.tenLamSan?.trim() || '',
    tenKhoaHoc: ap.tenKhoaHoc?.trim() || '',
    mucDichNuoi: ap.mucDichNuoi || '',
    hinhThucNuoi: ap.hinhThucNuoi || '',
    danBoMe: {
      duc: Number(ap.danBoMe?.duc || 0),
      cai: Number(ap.danBoMe?.cai || 0)
    },
    danHauBi: {
      duc: Number(ap.danHauBi?.duc || 0),
      cai: Number(ap.danHauBi?.cai || 0)
    },
    duoiMotTuoi: Number(ap.duoiMotTuoi || 0),
    trenMotTuoi: Number(ap.trenMotTuoi || 0)
  }));
};

/** ==========================
 * CREATE FARM
 * ========================== */
const createFarm = async (req, res) => {
  console.log('--- BƯỚC 1: BODY NHẬN ĐƯỢC ---', req.body);
  try {
    const error = validateFarmInput(req.body);
    if (error) {
      console.log('--- LỖI VALIDATE ---', error);
      return res.status(400).json({ message: error });
    }

    const farmData = {
      tenCoSo: req.body.tenCoSo,
      loaiCoSoDangKy: req.body.loaiCoSoDangKy,

      province: req.body.province || '',
      provinceName: req.body.provinceName || '',
      commune: req.body.commune || '',
      communeName: req.body.communeName || '',

      diaChiCoSo: req.body.diaChiCoSo,
      vido: req.body.vido || '',
      kinhdo: req.body.kinhdo || '',
      ngayThanhLap: parseDateOrNull(req.body.ngayThanhLap),
      trangThai: req.body.trangThai || 'Đang hoạt động',

      tenNguoiDaiDien: req.body.tenNguoiDaiDien,
      namSinh: req.body.namSinh || '',
      soCCCD: req.body.soCCCD,
      ngayCapCCCD: parseDateOrNull(req.body.ngayCapCCCD),
      noiCapCCCD: req.body.noiCapCCCD || '',
      soDienThoaiNguoiDaiDien: req.body.soDienThoaiNguoiDaiDien || '',
      diaChiNguoiDaiDien: req.body.diaChiNguoiDaiDien || '',
      emailNguoiDaiDien: req.body.emailNguoiDaiDien || '',

      giayPhepKinhDoanh: req.body.giayPhepKinhDoanh || '',
      issueDate: parseDateOrNull(req.body.issueDate),
      expiryDate: parseDateOrNull(req.body.expiryDate),

      mucDichNuoi: req.body.mucDichNuoi || '',
      hinhThucNuoi: req.body.hinhThucNuoi || '',
      maSoCoSoGayNuoi: req.body.maSoCoSoGayNuoi || '',
      nganhNgheKinhDoanhGo: req.body.nganhNgheKinhDoanhGo || '',
      loaiHinhKinhDoanhGo: req.body.loaiHinhKinhDoanhGo || '',
      loaiHinhCheBienGo: req.body.loaiHinhCheBienGo || '',
      nguonGocGo: req.body.nguonGocGo || '',

      woodProducts: normalizeWoodProducts(req.body.woodProducts),
      animalProducts: normalizeAnimalProducts(req.body.animalProducts)
    };

    console.log('--- BƯỚC 2: DỮ LIỆU CHUẨN BỊ LƯU ---', farmData);

    const newFarm = new Farm(farmData);
    await newFarm.save();

    console.log('--- BƯỚC 3: LƯU THÀNH CÔNG ---', newFarm._id);
    res.status(201).json(newFarm);
  } catch (error) {
    console.error("Lỗi khi tạo cơ sở:", error);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

/** ==========================
 * READ
 * ========================== */
const getAllFarms = async (req, res) => {
  try {
    const farms = await Farm.find();
    res.status(200).json(farms);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách:", error);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
    res.status(200).json(farm);
  } catch (error) {
    console.error("Lỗi khi lấy cơ sở:", error);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

/** ==========================
 * UPDATE
 * ========================== */
const updateFarm = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      provinceName: req.body.provinceName || '',
      communeName: req.body.communeName || '',
      ngayThanhLap: parseDateOrNull(req.body.ngayThanhLap),
      ngayCapCCCD: parseDateOrNull(req.body.ngayCapCCCD),
      issueDate: parseDateOrNull(req.body.issueDate),
      expiryDate: parseDateOrNull(req.body.expiryDate),
      woodProducts: normalizeWoodProducts(req.body.woodProducts),
      animalProducts: normalizeAnimalProducts(req.body.animalProducts)
    };

    const farm = await Farm.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!farm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });

    res.status(200).json(farm);
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

/** ==========================
 * DELETE
 * ========================== */
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
    res.status(200).json({ message: 'Xoá thành công.' });
  } catch (error) {
    console.error("Lỗi khi xoá:", error);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

/** ==========================
 * BULK CREATE
 * ========================== */
const bulkCreateFarms = async (req, res) => {
  try {
    const farms = (req.body || []).map(f => ({
      ...f,
      provinceName: f.provinceName || '',
      communeName: f.communeName || '',
      ngayThanhLap: parseDateOrNull(f.ngayThanhLap),
      ngayCapCCCD: parseDateOrNull(f.ngayCapCCCD),
      issueDate: parseDateOrNull(f.issueDate),
      expiryDate: parseDateOrNull(f.expiryDate),
      woodProducts: normalizeWoodProducts(f.woodProducts),
      animalProducts: normalizeAnimalProducts(f.animalProducts)
    }));

    const invalid = farms.find(f => validateFarmInput(f));
    if (invalid) return res.status(400).json({ message: 'Một số bản ghi thiếu thông tin bắt buộc.' });

    const result = await Farm.insertMany(farms);
    res.status(201).json(result);
  } catch (error) {
    console.error("Lỗi khi tạo hàng loạt:", error);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

/** ==========================
 * ADD PRODUCT
 * ========================== */
const addWoodProductToFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });

    const [woodProduct] = normalizeWoodProducts([req.body]);
    if (!woodProduct.tenLamSan || !woodProduct.khoiLuong) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm gỗ.' });
    }

    farm.woodProducts.push(woodProduct);
    await farm.save();

    res.status(201).json({ message: 'Thêm sản phẩm gỗ thành công.', product: woodProduct });
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm gỗ:", err);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};

const addAnimalProductToFarm = async (req, res) => {
  console.log('--- addAnimalProductToFarm ---', req.body);
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });

    const [animalProduct] = normalizeAnimalProducts([req.body]);
    if (!animalProduct.tenLamSan || !animalProduct.tenKhoaHoc) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm động vật.' });
    }

    farm.animalProducts.push(animalProduct);
    await farm.save();

    res.status(201).json({ message: 'Đã thêm sản phẩm động vật.', data: animalProduct });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm động vật:', error);
    res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm động vật.' });
  }
};

module.exports = {
  createFarm,
  getAllFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
  bulkCreateFarms,
  addWoodProductToFarm,
  addAnimalProductToFarm
};
