const parkingService = require('../../services/parkingService');

// Initialize slots on server start
parkingService.initializeSlots();

const allocateSlot = async (req, res) => {
    try {
        const slot = await parkingService.allocateSlot(req.body);
        res.json({ slot });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const freeSlot = async (req, res) => {
    try {
        await parkingService.freeSlot(req.body.slot);
        res.json({ message: 'Slot freed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getDashboard = async (req, res) => {
    try {
        const data = await parkingService.getDashboardData();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { allocateSlot, freeSlot, getDashboard };