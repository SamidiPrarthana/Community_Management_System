const express = require('express');
const router = express.Router();
const { assignParkingSlot, getLatestParkingSlot } = require('../../controller/Kavishka/leavingTimeController');

console.log("Parking Controller Function:", assignParkingSlot);

router.post('/assign', assignParkingSlot);
router.get('/latest', getLatestParkingSlot); // ✅ Now it's properly defined

module.exports = router;
