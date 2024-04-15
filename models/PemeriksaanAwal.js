const mongoose = require("mongoose");

const pemeriksaanAwalSchema = new mongoose.Schema(
  {
    pasien: {
      type: mongoose.Types.ObjectId,
      ref: "Pasien",
    },
    keluhan: {
      type: String,
    },
    riwayat_penyakit: {
      type: String,
    },
    umur: {
      type: Number,
    },
    status: {
      type: String,
      default: "1",
    },
  },
  { timestamps: true }
);

const PemeriksaanAwal = mongoose.model(
  "pemeriksaanAwal",
  pemeriksaanAwalSchema
);

module.exports = PemeriksaanAwal;
