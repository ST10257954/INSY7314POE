import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

const router = express.Router();

// POST /v1/employee/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔹 Email received:", email);
    console.log("🔹 Password received:", password);

    const employee = await Employee.findOne({ email });
    if (!employee) {
      console.log("❌ Employee not found");
      return res.status(401).json({ msg: "Employee not found" });
    }

    console.log("🔹 Hashed password in DB:", employee.password);

    // ✅ Ensure both values exist
    if (!password || !employee.password) {
      console.log("❌ Missing password or hash");
      return res.status(400).json({ msg: "Missing password or hash" });
    }

    // 🧩 Compare password safely with error handling
    const isMatch = await bcrypt
      .compare(password, employee.password)
      .catch(err => {
        console.error("❌ bcrypt compare error:", err);
        return false;
      });

    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(401).json({ msg: "Invalid password" });
    }

    // 🪪 Generate JWT for employee
    const token = jwt.sign(
      { id: employee._id, role: "employee" },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1h" }
    );

    console.log("✅ Employee login successful:", email);
    res.json({ msg: "Login successful", token });
  } catch (err) {
    console.error("❌ Employee login failed:", err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
});

export default router;
