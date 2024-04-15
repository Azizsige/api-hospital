const PemeriksaanDokter = require("../models/PemeriksaanDokter");

const getPemeriksaanDokter = async (req, res) => {
  try {
    let pemeriksaanDokter = await PemeriksaanDokter.find({}).populate({
      path: "pemeriksaan_awal",
      populate: {
        path: "pasien",
      },
    }); // Populasi properti 'pasien' untuk mendapatkan data pasien terkait

    // Mengecek apakah ada data pemeriksaan awal
    if (pemeriksaanDokter.length === 0)
      return res.status(200).json({
        status: "false",
        message: "Belum ada pemeriksaan dokter",
        pemeriksaanDokter,
      });

    return res.status(200).json({ status: "true", pemeriksaanDokter });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

const updatePemeriksaanDokter = async (req, res) => {
  const { id } = req.params;
  const { tindakan_selanjutnya } = req.body;

  try {
    const pemeriksaanDokter = await PemeriksaanDokter.findByIdAndUpdate(
      id,
      {
        tindakan_selanjutnya,
      },
      { new: true }
    );

    if (!pemeriksaanDokter) {
      return res.status(404).json({
        status: "false",
        message: "Pemeriksaan dokter tidak ditemukan",
      });
    }

    return res
      .status(200)
      .json({ status: "true", message: "Pemeriksaan dokter berhasil diubah" });
  } catch (error) {
    return res.status(500).json({ status: "false", message: error.message });
  }
};

module.exports = {
  getPemeriksaanDokter,
  updatePemeriksaanDokter,
};
