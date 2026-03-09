const mongoose = require("mongoose");

const DanSoSchema = new mongoose.Schema({
  danBoMe: {
    duc: { type: Number, default: 0 },
    cai: { type: Number, default: 0 }
  },

  danHauBi: {
    duc: { type: Number, default: 0 },
    cai: { type: Number, default: 0 }
  },

  duoiMotTuoi: { type: Number, default: 0 },
  trenMotTuoi: { type: Number, default: 0 },

  tongDan: { type: Number, default: 0 }
});

const AnimalProductSchema = new mongoose.Schema({

  tenLamSan: String,
  tenKhoaHoc: String,

  danSo: DanSoSchema,

  lichSuTangDan: [
    {
      ngay: Date,
      soLuong: Number,
      lyDo: String
    }
  ],

  lichSuGiamDan: [
    {
      ngay: Date,
      soLuong: Number,
      lyDo: String
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("AnimalProduct", AnimalProductSchema);