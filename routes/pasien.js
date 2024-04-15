const express = require("express");
const router = express.Router();

const pasienController = require("../controllers/pasienController");
const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");

router.get("/", pasienController.getPasien);
router.post(
  "/",
  [
    body("nama").custom((value, { req }) => {
      if (!value) {
        throw new Error("Nama harus diisi");
      }
      return true;
    }),
    body("no_hp").custom((value, { req }) => {
      if (!value) {
        throw new Error("Nomor HP harus diisi");
      } else if (isNaN(value)) {
        throw new Error("Nomor HP harus angka");
      }
      return true;
    }),
    body("jenis_pasien").custom((value, { req }) => {
      if (!value) {
        throw new Error("Jenis Pasien harus diisi");
      }

      const validValues = ["umum", "bpjs", "asuransi"];

      if (!validValues.includes(value.toLowerCase())) {
        throw new Error("Jenis Pasien harus umum, bpjs, atau asuransi");
      }

      return true;
    }),
  ],
  pasienController.createPasien
);
router.delete("/:id", pasienController.deletePasienById);
router.delete("/", pasienController.deletePasienMany);
router.get("/:id", pasienController.getPasienById);
router.put(
  "/:id",
  [
    body("nama").custom((value, { req }) => {
      if (!value) {
        throw new Error("Nama harus diisi");
      }
      return true;
    }),
    body("no_hp").custom((value, { req }) => {
      if (!value) {
        throw new Error("Nomor HP harus diisi");
      } else if (isNaN(value)) {
        throw new Error("Nomor HP harus angka");
      }
      return true;
    }),
    body("jenis_pasien").custom((value, { req }) => {
      if (!value) {
        throw new Error("Jenis Pasien harus diisi");
      }

      const validValues = ["umum", "bpjs", "asuransi"];

      if (!validValues.includes(value.toLowerCase())) {
        throw new Error("Jenis Pasien harus umum, bpjs, atau asuransi");
      }

      return true;
    }),
  ],
  pasienController.updatePasien
);

module.exports = router;
