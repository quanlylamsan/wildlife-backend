// controllers/farmController.js
const Farm = require('../models/Farm');
const { validationResult } = require('express-validator'); // Cần nếu bạn sử dụng validation

// Hàm xử lý tạo hàng loạt cơ sở
exports.batchCreateFarms = async (req, res) => {
    const farmsData = req.body.farms;
    const userId = req.user.id; // Lấy ID người dùng từ token đã xác thực

    if (!farmsData || !Array.isArray(farmsData) || farmsData.length === 0) {
        return res.status(400).json({ message: 'Không có dữ liệu cơ sở nào được cung cấp để nhập.' });
    }

    let importedCount = 0;
    let failedCount = 0;
    const errors = [];

    for (const farmData of farmsData) {
        try {
            const newFarm = new Farm({
                ...farmData,
                userId: userId,
                // Đảm bảo tên trường khớp với model Mongoose của bạn
                tenCoSo: farmData.tenCoSo,
                diaChi: farmData.diaChi,
                vido: farmData.vido,
                kinhdo: farmData.kinhdo,
                tinhThanhPho: farmData.tinhThanhPho,
                xaPhuong: farmData.xaPhuong,
                tenChuCoSo: farmData.tenChuCoSo,
                namSinh: farmData.namSinh,
                soCanCuoc: farmData.soCanCuoc,
                ngayCap: farmData.ngayCap,
                noiCap: farmData.noiCap,
                soDienThoai: farmData.soDienThoai,
                diaChiNguoiDaiDien: farmData.diaChiNguoiDaiDien,
                mucDichNuoi: farmData.mucDichNuoi,
                hinhThucNuoi: farmData.hinhThucNuoi,
                maSoCoSo: farmData.maSoCoSo,
                hoTenKinhDoanhGo: farmData.hoTenKinhDoanhGo,
                emailNguoiDaiDien: farmData.emailNguoiDaiDien,
            });
            await newFarm.save();
            importedCount++;
        } catch (error) {
            failedCount++;
            let errorMessage = `Lỗi khi lưu cơ sở "${farmData.tenCoSo || 'Không rõ tên'}": ${error.message}`;
            if (error.code === 11000) { // Lỗi trùng lặp key (ví dụ: mã số cơ sở duy nhất)
                errorMessage = `Cơ sở "${farmData.tenCoSo || 'Không rõ tên'}" đã tồn tại (mã số trùng lặp).`;
            } else if (error.errors) {
                // Lỗi validation từ Mongoose
                const validationErrors = Object.values(error.errors).map(err => err.message).join(', ');
                errorMessage = `Cơ sở "${farmData.tenCoSo || 'Không rõ tên'}" không hợp lệ: ${validationErrors}`;
            }
            errors.push(errorMessage);
            console.error('Batch import error for farm:', farmData, error);
        }
    }

    if (importedCount > 0) {
        res.status(200).json({
            message: 'Nhập dữ liệu hoàn tất.',
            importedCount,
            failedCount,
            errors,
            success: true
        });
    } else {
        res.status(400).json({
            message: 'Không có cơ sở nào được nhập thành công.',
            importedCount,
            failedCount,
            errors,
            success: false
        });
    }
};

// Hàm lấy tất cả các cơ sở
exports.getAllFarms = async (req, res) => {
    try {
        // Lọc theo userId nếu bạn muốn mỗi người dùng chỉ thấy cơ sở của họ
        // Hoặc Farm.find({}) để lấy tất cả nếu không cần lọc theo người dùng
        const farms = await Farm.find({ userId: req.user.id });
        res.status(200).json({
            success: true,
            count: farms.length,
            data: farms
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy dữ liệu cơ sở.',
            error: error.message
        });
    }
};

// Hàm tạo một cơ sở mới (cho route /create-single-farm)
exports.createFarm = async (req, res) => {
    try {
        // Lấy userId từ req.user (đã được thêm bởi authMiddleware)
        const userId = req.user.id;

        // Tạo một đối tượng farm mới từ req.body và thêm userId
        const newFarm = new Farm({
            ...req.body,
            userId: userId
        });

        await newFarm.save();
        res.status(201).json(newFarm);
    } catch (error) {
        console.error('Lỗi khi tạo cơ sở:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Lỗi dữ liệu đầu vào', errors: error.errors });
        }
        res.status(500).json({ message: 'Lỗi server khi tạo cơ sở.', error: error.message });
    }
};

// Bạn có thể thêm các hàm controller khác ở đây (ví dụ: getFarmById, updateFarm, deleteFarm)
// exports.getFarmById = async (req, res) => { ... };
// exports.updateFarm = async (req, res) => { ... };
// exports.deleteFarm = async (req, res) => { ... };
