const Pasien = require("../models/Pasien");
const PemeriksaanAwal = require("../models/PemeriksaanAwal");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const getPasien = async (req, res) => {
  try {
    const pasiens = await Pasien.find({});
    if (pasiens.length == 0)
      return res
        .status(200)
        .json({ status: "false", message: "Belum ada pasien", pasiens });
    return res.status(200).json({ status: "true", pasiens });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const getPasienById = (req, res) => {
  const { id } = req.params;
  Pasien.findById(id)
    .then((pasien) => {
      if (!pasien) {
        return res.status(404).json({
          status: "false",
          message: "Pasien tidak ditemukan",
        });
      }
      return res.status(200).json({ status: "true", pasien });
    })
    .catch((error) => {
      return res.status(500).json({ status: "false", message: error.message });
    });
};

const createPasien = async (req, res) => {
  try {
    const { nama, no_hp, jenis_pasien } = req.body;

    // Cek apakah pasien dengan nama yang sama sudah ada sebelumnya
    const pasienExist = await Pasien.findOne({ nama: nama });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = errors.array().map((err) => ({ msg: err.msg }));
      return res.status(400).json({ errors: extractedErrors });
    }

    if (pasienExist) {
      return res.status(400).json({
        status: "false",
        message: `Pasien dengan nama ${nama} sudah ada`,
      });
    }

    // Jika pasien tidak ada, buat pasien baru
    const pasien = await Pasien.create({
      nama,
      no_hp,

      // Mengonversi jenis_pasien menjadi huruf depannya kapital
      jenis_pasien:
        jenis_pasien.charAt(0).toUpperCase() + jenis_pasien.slice(1),

      // jenis_pasien: jenis_pasien.toUpperCase(),
    });

    const pemeriksaanAwal = await PemeriksaanAwal.create({
      pasien: pasien._id,
      keluhan: "",
      riwayat_penyakit: "",
      umur: 0,
    });

    return res.status(201).json({
      status: "true",
      message: "Pasien berhasil dibuat",
      pasien,
    });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const updatePasien = async (req, res) => {
  const { id } = req.params;
  const { nama, no_hp, jenis_pasien } = req.body;
  try {
    const pasien = await Pasien.findByIdAndUpdate(
      id,
      {
        nama,
        no_hp,
        jenis_pasien: jenis_pasien.toUpperCase(),
      },
      { new: true }
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = errors.array().map((err) => ({ msg: err.msg }));
      return res.status(400).json({ errors: extractedErrors });
    }
    return res
      .status(200)
      .json({ status: "true", message: "Pasien berhasil diubah" });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const deletePasienById = async (req, res) => {
  const { id } = req.params;
  try {
    const pasien = await Pasien.findByIdAndDelete(id);
    if (!pasien) {
      return res
        .status(404)
        .json({ status: "false", message: "Pasien tidak ditemukan" });
    }
    return res
      .status(200)
      .json({ status: "true", message: "Pasien berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const deletePasienMany = async (req, res) => {
  const ids = req.body.ids.split(",");
  try {
    const pasien = await Pasien.deleteMany({ _id: { $in: ids } });

    if (pasien.deletedCount === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "Pasien tidak ditemukan" });
    }
    return res
      .status(200)
      .json({ status: "true", message: "Pasien berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

// delete banyak pasien dengan mengambil id pasien dari req.body
// const deletePasien = async (req, res) => {
//   let ids = req.body.ids; // Mengambil data ID pasien dari body request

//   // Mengekstrak nilai ID dari properti ids jika objek diterima
//   if (typeof ids === "object" && ids.ids) {
//     ids = ids.ids;
//   }

//   // Memisahkan string ID jika masih belum dalam bentuk array
//   if (typeof ids === "string") {
//     ids = ids.split(",");
//   }

//   try {
//     // Mengonversi setiap string ID pasien menjadi tipe ObjectId
//     const parsedIds = ids.map((id) => new mongoose.Types.ObjectId(id));

//     // Menghapus pasien yang memiliki _id di dalam array parsedIds
//     const pasien = await Pasien.deleteMany({ _id: { $in: parsedIds } });

//     if (pasien.deletedCount === 0) {
//       return res
//         .status(400)
//         .json({ status: "false", message: "Pasien tidak ditemukan" });
//     }

//     return res
//       .status(200)
//       .json({ status: "true", message: "Pasien berhasil dihapus" });
//   } catch (error) {
//     return res.status(500).json({ status: "false", message: error.message });
//   }
// };

module.exports = {
  getPasien,
  getPasienById,
  createPasien,
  updatePasien,
  deletePasienById,
  deletePasienMany,
};
