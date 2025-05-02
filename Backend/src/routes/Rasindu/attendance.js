const express = require("express");
const router = express.Router();
const Attendance = require("../../model/Rasindu/Attendance");
const Employee = require("../../model/Rasindu/Employee");

// Helper function to calculate working hours
const calculateWorkingHours = async (employeeId, year, month) => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  const records = await Attendance.find({
    employeeId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  let totalHours = 0;
  records.forEach(record => {
    if (record.checkIn && record.checkOut) {
      const checkIn = new Date(record.checkIn);
      const checkOut = new Date(record.checkOut);
      totalHours += (checkOut - checkIn) / (1000 * 60 * 60); // in hours
    }
  });

  return totalHours;
};

// ✅ Mark attendance with delay check
router.post("/mark", async (req, res) => {
  const { empId } = req.body;

  if (!empId) {
    return res.status(400).json({ error: "EMP ID is required." });
  }

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const currentTime = new Date();

  try {
    let record = await Attendance.findOne({ employeeId: empId, date: today });

    if (!record) {
      // Check-in
      record = new Attendance({
        employeeId: empId,
        date: today,
        checkIn: currentTime,
      });
      await record.save();
      return res.json({ message: "Check-in successful", record });
    }

    if (!record.checkOut) {
      const checkInTime = new Date(record.checkIn);
      const timeDifference = (currentTime - checkInTime) / 1000; // in seconds

      if (timeDifference < 15) {
        return res.status(400).json({
          error: "Please wait at least 30 seconds before checking out.",
        });
      }

      // Check-out
      record.checkOut = currentTime;
      await record.save();
      return res.json({ message: "Check-out successful", record });
    }

    return res.status(400).json({
      error: "Attendance already completed for today.",
    });

  } catch (err) {
    console.error("Attendance marking error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Salary of one employee
router.get("/employee/:employeeId/:year/:month", async (req, res) => {
  const { employeeId, year, month } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const totalHours = await calculateWorkingHours(employeeId, year, month);
    const monthlySalary = totalHours * employee.hourlyRate;

    res.json({
      employeeId: employee.employeeId,
      name: employee.name,
      role: employee.role,
      totalHours: parseFloat(totalHours.toFixed(2)),
      hourlyRate: employee.hourlyRate,
      monthlySalary: parseFloat(monthlySalary.toFixed(2)),
    });
  } catch (err) {
    console.error("Salary calculation error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ All Employees' Salary Report
router.get("/monthlysal/:year/:month", async (req, res) => {
  const { year, month } = req.params;

  try {
    const employees = await Employee.find();
    const results = await Promise.all(employees.map(async (emp) => {
      const totalHours = await calculateWorkingHours(emp.employeeId, year, month);
      const monthlySalary = totalHours * emp.hourlyRate;

      return {
        employeeId: emp.employeeId,
        name: emp.name,
        role: emp.role,
        totalHours: parseFloat(totalHours.toFixed(2)),
        hourlyRate: emp.hourlyRate,
        monthlySalary: parseFloat(monthlySalary.toFixed(2)),
      };
    }));

    res.json(results);
  } catch (err) {
    console.error("Error fetching salary report:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
