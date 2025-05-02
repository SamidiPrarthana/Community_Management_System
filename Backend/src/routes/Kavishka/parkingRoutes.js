const express = require('express');
const router = express.Router();
const parkingController = require('../../controller/Kavishka/parkingController');

router.post('/allocate_slot', parkingController.allocateSlot);
router.post('/free_slot', parkingController.freeSlot);
router.get('/dashboard', parkingController.getDashboard);

module.exports = router;