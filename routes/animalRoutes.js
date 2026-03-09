const express = require("express");
const router = express.Router();

const AnimalProduct = require("../models/AnimalProduct");
const capNhatTongDan = require("../utils/updateTotal");

/* API TĂNG ĐÀN */
router.post("/tang-dan/:id", async (req, res) => {

  try {
    const { soLuong } = req.body;

    const animal = await AnimalProduct.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({ message: "Không tìm thấy loài" });
    }

    animal.danSo.trenMotTuoi += Number(soLuong);

    capNhatTongDan(animal);

    await animal.save();

    res.json(animal);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});


/* API GIẢM ĐÀN */
router.post("/giam-dan/:id", async (req, res) => {

  try {
    const { soLuong } = req.body;

    const animal = await AnimalProduct.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({ message: "Không tìm thấy loài" });
    }

    animal.danSo.trenMotTuoi -= Number(soLuong);

    capNhatTongDan(animal);

    await animal.save();

    res.json(animal);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

module.exports = router;