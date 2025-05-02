const Parking = require('../../model/Kavishka/leavingModel');

exports.assignParkingSlot = async (req, res) => {
    try {
        const { departureTimes, availableDays } = req.body;

        if (!availableDays.length || !departureTimes) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newParking = new Parking({

            departureTimes,
            availableDays,

        });

        await newParking.save();
        res.status(201).json({ message: "Parking slot assigned successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error assigning parking slot", error });
    }
};

// Inside leavingTimeController.js
exports.getLatestParkingSlot = async (req, res) => {
    try {
        const latest = await Parking.findOne().sort({ _id: -1 }); // Get latest record
        if (!latest) return res.status(404).json({ message: "No data found" });

        res.json(latest);
    } catch (err) {
        res.status(500).json({ message: "Error fetching data", error: err });
    }
};
