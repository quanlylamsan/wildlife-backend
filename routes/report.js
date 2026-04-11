const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Endpoint riêng cho Quy hoạch
router.get('/quyhoach/:year?', (req, res) => {
    const { year } = req.params;
    
    // 1. Xác định các kịch bản tìm file:
    // Ưu tiên 1: QH_2024.xlsx (nếu có riêng theo năm)
    // Ưu tiên 2: QH.xlsx (file tổng hợp tất cả các biểu)
    const specificFile = `QH_${year}.xlsx`;
    const generalFile = `QH.xlsx`;
    
    const specificPath = path.resolve(process.cwd(), 'data', 'reports', specificFile);
    const generalPath = path.resolve(process.cwd(), 'data', 'reports', generalFile);

    let finalPath = '';

    // Logic kiểm tra file
    if (year && fs.existsSync(specificPath)) {
        finalPath = specificPath;
    } else if (fs.existsSync(generalPath)) {
        finalPath = generalPath;
    }

    console.log(`[Debug] Đang truy xuất dữ liệu Quy hoạch tại: ${finalPath}`);

    if (finalPath) {
        // Thiết lập Header chuẩn cho Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        // Thêm Content-Disposition để tránh lỗi font hoặc lỗi nhận diện file ở frontend
        const downloadName = year ? `QH_${year}.xlsx` : `QH.xlsx`;
        res.setHeader('Content-Disposition', `attachment; filename=${downloadName}`);

        res.sendFile(finalPath, (err) => {
            if (err) {
                console.error(`[Error] Lỗi khi gửi file: ${err}`);
                if (!res.headersSent) {
                    res.status(500).send("Lỗi máy chủ khi xuất file.");
                }
            }
        });
    } else {
        console.error(`[Error] Không tìm thấy bất kỳ file QH nào tại thư mục data/reports/`);
        res.status(404).json({ 
            message: "Hệ thống chưa có dữ liệu Quy hoạch. Vui lòng kiểm tra file QH.xlsx tại thư mục backend." 
        });
    }
});

module.exports = router;