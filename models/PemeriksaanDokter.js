const mongoose = require("mongoose");

const pemeriksaanDokterSchema = new mongoose.Schema(
  {
    pemeriksaan_awal: {
      type: mongoose.Types.ObjectId,
      ref: "pemeriksaanAwal",
    },
    tindakan_selanjutnya: {
      type: String,
    },
  },
  { timestamps: true }
);

const PemeriksaanDokter = mongoose.model(
  "pemeriksaanDokter",
  pemeriksaanDokterSchema
);

module.exports = PemeriksaanDokter;
