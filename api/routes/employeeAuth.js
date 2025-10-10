// Route: Handles employee registration and login using JWT authentication (stripe, 2025).

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

const router = express.Router();

// Register new employee
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, employeeId, role } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) return res.status(400).json({ message: "Employee already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newEmp = new Employee({
      fullName,
      email,
      password: hashed,
      employeeId: employeeId || `EMP-${Date.now()}`,
      role: role || "employee",
    });

    await newEmp.save();

    const token = jwt.sign(
      { id: newEmp._id, email: newEmp.email, role: newEmp.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(201).json({
      message: "Employee registered successfully",
      token,
      employee: {
        id: newEmp._id,
        fullName: newEmp.fullName,
        email: newEmp.email,
        role: newEmp.role,
      },
    });
  } catch (err) {
    console.error("Employee register error:", err);
    return res.status(500).json({ message: "Server error during employee registration" });
  }
});

// Employee login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) return res.status(401).json({ message: "Employee not found" });

    const match = await bcrypt.compare(password, employee.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: employee._id, email: employee.email, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: " Employee login successful",
      token,
      employee: {
        id: employee._id,
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role,
      },
    });
  } catch (err) {
    console.error("Employee login error:", err);
    return res.status(500).json({ message: "Server error during employee login" });
  }
});

export default router;

/* References
stripe, 2025. International payments 101: What they are and how they work. [Online] 
Available at: https://stripe.com/resources/more/international-payments-101-what-they-are-and-how-they-work
[Accessed 02 October 2025]. 
*/