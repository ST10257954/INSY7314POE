import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

const router = express.Router();

// Employee login (they cannot register themselves)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find employee by email
    const emp = await Employee.findOne({ email });
    if (!emp) return res.status(401).json({ message: "Invalid email or password" });

    // Compare password
    const match = await bcrypt.compare(password, emp.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    // Generate token
    const token = jwt.sign(
      { id: emp._id, role: emp.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: emp.role });
  } catch (err) {
    console.error("Employee login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
