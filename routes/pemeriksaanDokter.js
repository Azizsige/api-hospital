const express = require("express");
const router = express.Router();

const pemeriksaanDokterController = require("../controllers/pemeriksaanDokter");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", pemeriksaanDokterController.getPemeriksaanDokter);
// router.delete("/", pemeriksaanDokterController.deletePemeriksaanAwal);
// router.get("/:id", pemeriksaanDokterController.getPemeriksaanAwalById);
// router.put("/:id", pemeriksaanDokterController.updatePemeriksaanAwal);

module.exports = router;
