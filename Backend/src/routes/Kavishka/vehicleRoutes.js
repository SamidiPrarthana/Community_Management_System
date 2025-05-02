const express = require("express");
const router = express.Router();
const { registerVehicle, getUserByQRCode } = require("../../controller/Kavishka/vehicleController");

router.post("/vregister", registerVehicle);
router.get("/scan/:id", getUserByQRCode);

module.exports = router;