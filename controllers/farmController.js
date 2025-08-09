const Farm = require('../models/Farm');

// ==== VALIDATION HỖ TRỢ ====
const validateFarmInput = (data) => {
    const requiredFields = [
        'tenCoSo',
        'province',
        'commune',
        'diaChiCoSo',
        'tenNguoiDaiDien',
        'soCCCD',
        'loaiCoSoDangKy',
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
        return `Thiếu trường bắt buộc: ${missingFields.join(', ')}`;
    }

    return null;
};

const validateProductInput = (product, loaiCoSoDangKy) => {
    if (!product.tenLamSan || !product.khoiLuong) {
        return 'Tên lâm sản và khối lượng là bắt buộc.';
    }

    if (typeof loaiCoSoDangKy === 'string' && loaiCoSoDangKy.includes('gỗ')) {
        if (!product.loaiHinhCheBienGo || !product.nguonGocGo) {
            return 'Thiếu thông tin chế biến và nguồn gốc gỗ.';
        }
    } else {
        if (!product.mucDichNuoi || !product.hinhThucNuoi) {
            return 'Thiếu mục đích và hình thức nuôi.';
        }
    }

    return null;
};

// ==== TẠO MỚI CƠ SỞ ====
const createFarm = async (req, res) => {
	console.log('BODY NHẬN ĐƯỢC:', req.body); // Di chuyển vào đây
    try {
        const error = validateFarmInput(req.body);
        if (error) {
			console.log('--- LỖI Ở BƯỚC VALIDATE ---');
            return res.status(400).json({ message: error });
        }

        const newFarm = new Farm(req.body);
		console.log('--- BƯỚC 2: DỮ LIỆU SAU KHI QUA SCHEMA, CHUẨN BỊ LƯU ---');
        console.log(newFarm);
        await newFarm.save();
		 console.log('--- BƯỚC 3: DỮ LIỆU ĐÃ LƯU THÀNH CÔNG ---');
        res.status(201).json(newFarm);
    } catch (error) {
        console.error("Lỗi khi tạo cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== LẤY DANH SÁCH TẤT CẢ CƠ SỞ ====
const getAllFarms = async (req, res) => {
    try {
        const farms = await Farm.find();
        res.status(200).json(farms);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== LẤY CƠ SỞ THEO ID ====
const getFarmById = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }
        res.status(200).json(farm);
    } catch (error) {
        console.error("Lỗi khi lấy cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== CẬP NHẬT CƠ SỞ ====
const updateFarm = async (req, res) => {
    try {
        const farm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }
        res.status(200).json(farm);
    } catch (error) {
        console.error("Lỗi khi cập nhật cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== XOÁ CƠ SỞ ====
const deleteFarm = async (req, res) => {
    try {
        const farm = await Farm.findByIdAndDelete(req.params.id);
        if (!farm) {
            return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });
        }
        res.status(200).json({ message: 'Xoá cơ sở thành công.' });
    } catch (error) {
        console.error("Lỗi khi xoá cơ sở:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== TẠO HÀNG LOẠT CƠ SỞ ====
const bulkCreateFarms = async (req, res) => {
    try {
        const farms = req.body;

        const invalid = farms.find(f => validateFarmInput(f));
        if (invalid) {
            return res.status(400).json({ message: 'Một số bản ghi thiếu thông tin bắt buộc.' });
        }

        const result = await Farm.insertMany(farms);
        res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi khi tạo hàng loạt:", error);
        res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
};

// ==== THÊM GỖ (WOOD PRODUCT) VÀO FARM ====
const addWoodProductToFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });

    const { tenLamSan, khoiLuong, loaiHinhCheBienGo, nguonGocGo } = req.body;

    if (!tenLamSan || !khoiLuong || !loaiHinhCheBienGo || !nguonGocGo) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm gỗ.' });
    }

    const woodProduct = { tenLamSan, khoiLuong, loaiHinhCheBienGo, nguonGocGo };

    // 👇 Khởi tạo nếu cần
    if (!farm.woodProducts) farm.woodProducts = [];

    farm.woodProducts.push(woodProduct);
    await farm.save();

    res.status(201).json({ message: 'Thêm sản phẩm gỗ thành công.', product: woodProduct });
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm gỗ:", err);
    res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};


// ==== THÊM ĐỘNG VẬT (ANIMAL PRODUCT) VÀO FARM ====
const addAnimalProductToFarm = async (req, res) => {
	 // ----- BẮT ĐẦU CODE CHẨN ĐOÁN -----
  console.log('--- BÊN TRONG addAnimalProductToFarm ---');
  console.log('Content-Type Header:', req.headers['content-type']);
  console.log('BODY NHẬN ĐƯỢC:', req.body);
  // ----- KẾT THÚC CODE CHẨN ĐOÁN -----
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) return res.status(404).json({ message: 'Không tìm thấy cơ sở.' });

    const { tenLamSan, tenKhoaHoc, danBoMe, danHauBi, duoiMotTuoi, trenMotTuoi } = req.body;

    // Kiểm tra thiếu thông tin
    if (
      !tenLamSan || 
      !tenKhoaHoc ||
      !danBoMe || danBoMe.duc == null || danBoMe.cai == null ||
      !danHauBi || danHauBi.duc == null || danHauBi.cai == null ||
      duoiMotTuoi == null ||
      trenMotTuoi == null
    ) {
      return res.status(400).json({ message: 'Thiếu thông tin sản phẩm động vật.' });
    }

    const animalProduct = {
      tenLamSan,
      tenKhoaHoc,
      danBoMe,
      danHauBi,
      duoiMotTuoi,
      trenMotTuoi
    };

    farm.animalProducts.push(animalProduct);
    await farm.save();

    return res.status(201).json({ message: 'Đã thêm sản phẩm động vật.', data: animalProduct });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm động vật:', error);
    return res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm động vật.' });
  }
};


module.exports = {
    createFarm,
    getAllFarms,
    getFarmById,
    updateFarm,
    deleteFarm,
    bulkCreateFarms,
    addWoodProductToFarm, // mới
    addAnimalProductToFarm, // mới
};
