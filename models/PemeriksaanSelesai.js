const mongoose = require("mongoose");

const pemeriksaanAkhirSchema = new mongoose.Schema(
  {
    pemeriksaanAkhir: {
      type: mongoose.Types.ObjectId,
      ref: "PemeriksaanDokter",
    },
  },
  { timestamps: true }
);

const PemeriksaanAkhir = mongoose.model(
  "pemeriksaanAkhir",
  pemeriksaanAkhirSchema
);

module.exports = PemeriksaanAkhir;
