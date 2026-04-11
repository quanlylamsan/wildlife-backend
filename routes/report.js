const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

/**
 * Endpoint lấy dữ liệu Quy hoạch tổng hợp
 * Route: /api/reports/quyhoach/data
 */
router.get('/quyhoach/data', (req, res) => {
    // 1. Cố định tên file quy hoạch tổng hợp
    // Đảm bảo file này nằm tại: backend/data/reports/QH.xlsx
    const fileName = 'QH.xlsx';
    const filePath = path.resolve(process.cwd(), 'data', 'reports', fileName);

    console.log(`[Debug] Đang truy xuất dữ liệu Quy hoạch tại: ${filePath}`);

    // 2. Kiểm tra sự tồn tại của file
    if (fs.existsSync(filePath)) {
        // Thiết lập Header chuẩn để Frontend (axios/XLSX) xử lý tốt nhất
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=QH.xlsx');

        // Gửi file
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error(`[Error] Lỗi khi gửi file: ${err}`);
                if (!res.headersSent) {
                    res.status(500).send("Lỗi máy chủ khi truy xuất dữ liệu quy hoạch.");
                }
            }
        });
    } else {
        console.error(`[Error] Không tìm thấy dữ liệu tại thư mục data/reports/`);
        res.status(404).json({ 
            success: false,
            message: "Hệ thống chưa có dữ liệu Quy hoạch tổng hợp." 
        });
    }
});

module.exports = router;