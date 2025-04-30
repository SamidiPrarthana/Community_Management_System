const express = require("express");
const router = express.Router();
const Employee = require("../../model/Rasindu/Employee");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const transporter = require("../../utils/mailer");


// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Only PNG images are allowed'), false);
        }
    }
});

// Add Employee 
router.post("/add", upload.single("photo"), async (req, res) => {
    try {
        const { name, address, contact, email, role, hourlyRate } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : "";

        if (!name || !address || !contact || !email || !role || !hourlyRate) {
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "Email already exists." });
        }

        // Generate unique EMP ID
        let nextId = 1;
        const lastEmployee = await Employee.findOne().sort({ _id: -1 });

        if (lastEmployee && lastEmployee.employeeId && lastEmployee.employeeId.startsWith("EMP")) {
            const lastIdNumber = parseInt(lastEmployee.employeeId.replace("EMP", ""));
            if (!isNaN(lastIdNumber)) {
                nextId = lastIdNumber + 1;
            }
        }

        const employeeId = `EMP${nextId}`;

        // ✅ Define the new employee before saving
        const newEmployee = new Employee({
            name,
            address,
            contact,
            email,
            role,
            hourlyRate,
            photo,
            employeeId
        });

        await newEmployee.save();

        res.status(201).json({ message: "Employee added successfully!", employee: newEmployee });

    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("Error adding employee:", err);
        res.status(500).json({ 
            error: err.message.includes('PNG') ? 'Only PNG images are allowed' : "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});




// Read Employee Details
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Fetch Employee by ID
router.get("/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ error: "Employee not found" });
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Employee Details Update
router.put("/update/:id", upload.single("photo"), async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { name, email, role, hourlyRate, address, contact } = req.body;

        let updateData = { name, email, role, hourlyRate, address, contact };

        if (req.file) {
            updateData.photo = req.file.filename; // Update photo if uploaded
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateData, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json({ message: "Employee updated successfully!", updatedEmployee });
    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Delete Employee Details
router.delete("/delete/:id", async (req, res) => {
    try {
        const employeeId = req.params.id;
        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

        if (!deletedEmployee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        res.status(200).json({ message: "Employee deleted successfully!", deletedEmployee });

    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

module.exports = router;
