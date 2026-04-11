const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * Router xử lý dữ liệu Chuyển mục đích sử dụng rừng
 * Đường dẫn mẫu: /api/cmdsdr/2025
 */
router.get('/:year', (req, res) => {
    const { year } = req.params;
    
    // Quy tắc đặt tên file: CMDSDR-2025.xlsx
    const fileName = `CMDSDR-${year}.xlsx`;
    const filePath = path.resolve(process.cwd(), 'data', 'reports', fileName);

    console.log(`[Debug] Đang tìm hồ sơ CMDSDR tại: ${filePath}`);

    if (fs.existsSync(filePath)) {
        // Thiết lập Header chuẩn để trình duyệt và thư viện XLSX nhận diện đúng
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`[Error] Lỗi khi gửi file CMDSDR: ${err}`);
                if (!res.headersSent) {
                    res.status(500).send("Lỗi máy chủ khi truy xuất hồ sơ.");
                }
            }
        });
    } else {
        console.warn(`[Warn] Không tìm thấy file: ${fileName}`);
        res.status(404).json({ 
            success: false,
            message: `Hệ thống chưa có dữ liệu Chuyển mục đích sử dụng rừng năm ${year}.` 
        });
    }
});

module.exports = router;