// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

const router = express.Router();

/* -------------------------------- REGISTER ----------------------------------
   Customers register here; employees are assumed to already exist in DB.
-----------------------------------------------------------------------------*/
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role?.toLowerCase() || "customer",
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(201).json({
      message: "✅ User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

/* -------------------------------- LOGIN -------------------------------------
   Handles both customers and employees.
-----------------------------------------------------------------------------*/
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const roleLower = role?.toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    let account;

    // ✅ Employee login (case-insensitive, ensures proper matching)
    if (roleLower === "employee") {
      account = await Employee.findOne({ email: normalizedEmail });
    } 
    // ✅ Customer login
    else {
      account = await User.findOne({ email: normalizedEmail });
    }

    console.log("Looking for user:", normalizedEmail);
    console.log("Found account:", account ? account.email : "❌ None");

    // Handle missing user
    if (!account) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Ensure role consistency (avoid crash if missing)
    const dbRole = account.role ? account.role.toLowerCase() : null;
    if (roleLower && dbRole && roleLower !== dbRole) {
      return res.status(403).json({ message: `Access denied for role: ${role}` });
    }

    // ✅ Compare password hash
    const isMatch = await bcrypt.compare(password, account.password || "");
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      { id: account._id, email: account.email, role: dbRole || account.role || roleLower },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "✅ Login successful",
      token,
      user: {
        id: account._id,
        name: account.name || account.fullName,
        email: account.email,
        role: dbRole || account.role || roleLower,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
