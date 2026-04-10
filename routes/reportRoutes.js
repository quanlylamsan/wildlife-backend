// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * Route lấy file báo cáo tổng hợp theo năm
 * URL mẫu: http://localhost:10000/api/reports/2025
 * Quy tắc: Tìm file 2025.xlsx trong thư mục data/reports
 */
router.get('/:year', (req, res) => {
    const { year } = req.params;

    // Tên file bây giờ chỉ là năm (VD: 2025.xlsx)
    const fileName = `${year}.xlsx`;
    const filePath = path.join(__dirname, '../data/reports', fileName);

    // Kiểm tra sự tồn tại của file
    if (fs.existsSync(filePath)) {
        console.log(`[Success] Đang gửi file báo cáo tổng hợp năm: ${year}`);
        
        // Cấu hình Header để đảm bảo trình duyệt hiểu đây là file Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.sendFile(filePath);
    } else {
        console.warn(`[Error] Không tìm thấy dữ liệu năm: ${year} tại ${filePath}`);
        res.status(404).json({ 
            message: `Hệ thống chưa có dữ liệu báo cáo cho năm ${year}` 
        });
    }
});

module.exports = router;