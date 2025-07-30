const express = require('express');
const router = express.Router();

const {
  createFarm,
  getAllFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
  importFarmsFromExcel,
  addAnimalToFarm,
} = require('../controllers/farmController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, createFarm);
router.post('/import', verifyToken, importFarmsFromExcel);
router.get('/', verifyToken, getAllFarms);
router.get('/:id', verifyToken, getFarmById);
router.put('/:id', verifyToken, updateFarm);
router.delete('/:id', verifyToken, deleteFarm);
router.post('/:id/add-animal', verifyToken, addAnimalToFarm);

// ❗ Quan trọng: export chính `router`
module.exports = router;
