const express = require("express");
const router = express.Router();
const Employee = require("../../model/Rasindu/Employee");
const Attendance = require("../../model/Rasindu/Attendance");

// Helper function to calculate working hours for an employee in a specific month
const calculateWorkingHours = async (employeeId, year, month) => {
  const startOfMonth = new Date(year, month - 1, 1); // Starting day of the month
  const endOfMonth = new Date(year, month, 0); // Ending day of the month

  const records = await Attendance.find({
    employeeId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  let totalHours = 0;

  records.forEach(record => {
    if (record.checkIn && record.checkOut) {
      const checkInTime = new Date(record.checkIn);
      const checkOutTime = new Date(record.checkOut);
      totalHours += (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert ms to hours
    }
  });

  return totalHours;
};

// Route to get salary data for a specific employee in a specific month
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
    console.error("Error calculating employee salary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get monthly salary report for all employees
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
    console.error("Error fetching monthly salary report:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

module.exports = router;
