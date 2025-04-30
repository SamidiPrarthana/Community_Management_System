const express = require("express");
const router = express.Router();
const Attendance = require("../../model/Rasindu/Attendance");
const Employee = require("../../model/Rasindu/Employee");

// Mark Check-in/Check-out for an employee
router.post("/mark", async (req, res) => {
  const { empId } = req.body;

  if (!empId) {
    return res.status(400).json({ error: "EMP ID is required." });
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const currentTime = new Date();

  try {
    let record = await Attendance.findOne({ employeeId: empId, date: today });

    if (!record) {
      // No record yet for today → Check-In
      record = new Attendance({ employeeId: empId, date: today, checkIn: currentTime });
      await record.save();
      return res.json({ message: "Check-in successful", record });
    }

    if (!record.checkOut) {
      // Already checked in → Check-Out
      record.checkOut = currentTime;
      await record.save();
      return res.json({ message: "Check-out successful", record });
    }

    // Already checked out
    return res.status(400).json({ error: "Attendance already completed for today." });

  } catch (err) {
    console.error("Attendance marking error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Calculate Monthly Working Hours for an employee
router.get("/monthly-hours/:employeeId", async (req, res) => {
  const { employeeId } = req.params;

  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the current month

    // Find all attendance records for the employee within the current month
    const records = await Attendance.find({
      employeeId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Calculate total working hours
    let totalHours = 0;

    records.forEach(record => {
      if (record.checkIn && record.checkOut) {
        const checkInTime = new Date(record.checkIn);
        const checkOutTime = new Date(record.checkOut);

        // Get the difference in hours and minutes
        const diffInMillis = checkOutTime - checkInTime;
        const diffInHours = diffInMillis / (1000 * 60 * 60); // Convert milliseconds to hours
        totalHours += diffInHours;
      }
    });

    res.json({ message: `Total working hours for the month: ${totalHours.toFixed(2)} hours`, totalHours: totalHours });
  } catch (err) {
    console.error("Error calculating monthly hours:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Monthly Salary Calculation
router.get("/monthlysal", async (req, res) => {
  try {
    const employees = await Employee.find();
    const results = await Promise.all(employees.map(async (emp) => {
      const records = await Attendance.find({ employeeId: emp.employeeId, date: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } });
      let totalHours = 0;
      records.forEach(record => {
        if (record.checkIn && record.checkOut) {
          const checkInTime = new Date(record.checkIn);
          const checkOutTime = new Date(record.checkOut);
          totalHours += (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert ms to hours
        }
      });
      
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
    console.error("Salary calculation error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
