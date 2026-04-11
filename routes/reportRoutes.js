const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/:year', (req, res) => {
    const { year } = req.params;

    // Sử dụng path.resolve và process.cwd() để lấy đường dẫn từ thư mục gốc của project
    // Điều này giúp tránh lỗi sai đường dẫn khi cấu trúc thư mục thay đổi trên server
    const fileName = `${year}.xlsx`;
    const filePath = path.resolve(process.cwd(), 'data', 'reports', fileName);

    console.log(`[Debug] Đang tìm file tại: ${filePath}`);

    if (fs.existsSync(filePath)) {
        console.log(`[Success] Đang gửi file: ${fileName}`);
        
        // Header quan trọng để trình duyệt không bị lỗi khi nhận file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.sendFile(filePath);
    } else {
        console.error(`[Error] Không thấy file: ${filePath}`);
        res.status(404).json({ 
            message: `Hệ thống chưa có dữ liệu báo cáo cho năm ${year}` 
        });
    }
});

module.exports = router;