const express = require("express");
const router = express.Router();
const Employee = require("../../model/Rasindu/Employee");
const Attendance = require("../../model/Rasindu/Attendance");

const calculateWorkingHours = async (employeeId) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split("T")[0];

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

router.get("/monthlysal", async (req, res) => {
  try {
    const employees = await Employee.find();
    const results = await Promise.all(employees.map(async (emp) => {
      const hours = await calculateWorkingHours(emp.employeeId);
      const salary = hours * emp.hourlyRate;
      
      return {
        employeeId: emp.employeeId,
        name: emp.name,
        role: emp.role,
        totalHours: parseFloat(hours.toFixed(2)),
        hourlyRate: emp.hourlyRate,
        monthlySalary: parseFloat(salary.toFixed(2)),
      };
    }));

    res.json(results);
  } catch (err) {
    console.error("Salary calculation error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add this new route to your salary.js
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findOne({ employeeId });
    
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const hours = await calculateWorkingHours(employeeId);
    const salary = hours * employee.hourlyRate;
    
    res.json({
      employeeId: employee.employeeId,
      name: employee.name,
      role: employee.role,
      totalHours: parseFloat(hours.toFixed(2)),
      hourlyRate: employee.hourlyRate,
      monthlySalary: parseFloat(salary.toFixed(2)),
    });
    
  } catch (err) {
    console.error("Employee salary calculation error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;