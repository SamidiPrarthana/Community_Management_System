const Vehicle = require("../../model/Kavishka/vehicleModel");
const User = require("../../model/Kavishka/userModel");
const generateQR = require("../../utils/qrGenerator");

exports.registerVehicle = async (req, res) => {
    try {
        const { residentId, name, vehicleNumber, vehicleType } = req.body;

        const user = await User.findById(residentId);
        if (!user || user.userType !== "Resident") {
            return res.status(400).json({ error: "Invalid Resident ID or not a Resident user." });
        }

        const qrText = `${residentId}`;
        const qrCodeUrl = await generateQR(qrText);

        const newVehicle = new Vehicle({
            residentId,
            name,
            vehicleNumber,
            vehicleType,
            qrCodeUrl,
        });

        await newVehicle.save();

        res.status(201).json({
            message: "Vehicle registered successfully!",
            qrCodeUrl,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserByQRCode = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const vehicle = await Vehicle.findOne({ residentId: id });

        if (!user || !vehicle) {
            return res.status(404).json({ error: "Details not found" });
        }

        res.status(200).json({
            name: user.name,
            userId: user._id,
            vehicleNumber: vehicle.vehicleNumber,
            vehicleType: vehicle.vehicleType,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};