const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/:year', (req, res) => {
    const { year } = req.params;
    
    // Tên file theo quy tắc bạn đặt: trongkhaithac-2025.xlsx
    const fileName = `trongkhaithac-${year}.xlsx`;
    const filePath = path.resolve(process.cwd(), 'data', 'reports', fileName);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.sendFile(filePath);
    } else {
        res.status(404).json({ message: `Hệ thống chưa cập nhật dữ liệu năm ${year}` });
    }
});

module.exports = router;