router.post("/tang-dan/:id", async (req, res) => {

  const { soLuong, lyDo } = req.body;

  const animal = await AnimalProduct.findById(req.params.id);

  animal.danSo.trenMotTuoi += soLuong;

  animal.lichSuTangDan.push({
    ngay: new Date(),
    soLuong,
    lyDo
  });

  await capNhatTongDan(animal);

  await animal.save();

  res.json(animal);
});