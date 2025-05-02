const Apartment = require("../../model/Kavishka/Apartment");

exports.registerApartment = async (req, res) => {
    try {
        const { residentId, apartmentNo, floor, block } = req.body;

        const newApartment = new Apartment({
            residentId,
            apartmentNo,
            floor,
            block,
        });

        await newApartment.save();
        res.json({ message: "Apartment registered" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
