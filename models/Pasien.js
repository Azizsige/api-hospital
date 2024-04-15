const mongoose = require("mongoose");

const pasienSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    no_hp: {
      type: Number,
      required: true,
    },
    jenis_pasien: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const Pasien = mongoose.model("Pasien", pasienSchema);

module.exports = Pasien;
