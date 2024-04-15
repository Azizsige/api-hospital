const PemeriksaanDokter = require("../models/PemeriksaanDokter");
const PemeriksaanAwal = require("../models/PemeriksaanAwal");

const getPemeriksaanAwal = async (req, res) => {
  try {
    let pemeriksaanAwal = await PemeriksaanAwal.find({}).populate("pasien"); // Populasi properti 'pasien' untuk mendapatkan data pasien terkait

    // Mengecek apakah ada data pemeriksaan awal
    if (pemeriksaanAwal.length === 0)
      return res.status(200).json({
        status: "false",
        message: "Belum ada pemeriksaan awal",
        pemeriksaanAwal,
      });

    // Memeriksa setiap pemeriksaan awal
    pemeriksaanAwal = pemeriksaanAwal.map((item) => {
      // Jika keluhan, riwayat_penyakit, atau umur sudah diisi
      if (item.keluhan || item.riwayat_penyakit || item.umur) {
        // Mengubah status menjadi "2"
        item.status = "2";
        // Menyimpan perubahan ke database
        item.save();
      }
      return item;
    });

    return res.status(200).json({ status: "true", pemeriksaanAwal });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const getPemeriksaanAwalById = async (req, res) => {
  const { id } = req.params;
  try {
    const pemeriksaanAwal = await PemeriksaanAwal.findById(id).populate({
      path: "pasien",
      select: ["nama"],
    });

    if (!pemeriksaanAwal) {
      return res.status(404).json({
        status: "false",
        message: "Pemeriksaan awal tidak ditemukan",
      });
    }

    return res.status(200).json({ status: "true", pemeriksaanAwal });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const updatePemeriksaanAwal = async (req, res) => {
  const { id } = req.params;
  const { keluhan, riwayat_penyakit, umur } = req.body;

  try {
    const pemeriksaanAwal = await PemeriksaanAwal.findByIdAndUpdate(
      id,
      {
        keluhan,
        riwayat_penyakit,
        umur,
      },
      { new: true }
    );

    const pemeriksaanDokter = await PemeriksaanDokter.findOne({
      pemeriksaan_awal: id,
    });

    // cek jika pemeriksaan dokter belum ada
    if (!pemeriksaanDokter) {
      await PemeriksaanDokter.create({
        pemeriksaan_awal: id,
        tindakan_selanjutnya: "",
      });
    } else {
      await PemeriksaanDokter.findOneAndUpdate(
        { pemeriksaan_awal: id },
        { tindakan_selanjutnya: "" }
      );
    }

    return res
      .status(200)
      .json({ status: "true", message: "Pemeriksaan awal berhasil diubah" });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const deletePemeriksaanAwal = async (req, res) => {
  const ids = req.body.ids.split(",");

  try {
    const pasien = await PemeriksaanAwal.deleteMany({ _id: { $in: ids } });

    if (pasien.deletedCount === 0) {
      return res.status(404).json({
        status: "false",
        message: "Data Pemeriksaan Awal tidak ditemukan",
      });
    }
    return res.status(200).json({
      status: "true",
      message: "Data Pemeriksaan Awal berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

module.exports = {
  getPemeriksaanAwal,
  getPemeriksaanAwalById,
  updatePemeriksaanAwal,
  deletePemeriksaanAwal,
};
