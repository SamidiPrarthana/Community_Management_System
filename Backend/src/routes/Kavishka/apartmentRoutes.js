const express = require("express");
const router = express.Router();
const { registerApartment } = require("../../controller/Kavishka/apartmentController");

router.post("/register", registerApartment);

module.exports = router;
