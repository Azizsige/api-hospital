const express = require("express");
const router = express.Router();

const pemeriksaanAwalController = require("../controllers/pemeriksaanAwal");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", pemeriksaanAwalController.getPemeriksaanAwal);
router.delete("/", pemeriksaanAwalController.deletePemeriksaanAwal);
router.get("/:id", pemeriksaanAwalController.getPemeriksaanAwalById);
router.put("/:id", pemeriksaanAwalController.updatePemeriksaanAwal);

module.exports = router;
