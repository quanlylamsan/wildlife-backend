const capNhatTongDan = (animal) => {

  const dan = animal.danSo;

  animal.danSo.tongDan =
    dan.danBoMe.duc +
    dan.danBoMe.cai +
    dan.danHauBi.duc +
    dan.danHauBi.cai +
    dan.duoiMotTuoi +
    dan.trenMotTuoi;
};

module.exports = capNhatTongDan;