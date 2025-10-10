// Route: Manages user and employee authentication (register + login) (stripe, 2025).
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

const router = express.Router();

// Customers register here; employees are preloaded in DB.

router.post("/register", async (req, res) => {
  try {
    const { name, idNumber, accountNumber, email, password, role } = req.body;

    // Validate fields
    if (!name || !idNumber || !accountNumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password securely (includes PEPPER)
    const hashedPassword = await bcrypt.hash(password + process.env.PEPPER, 10);

    // Create and save the new user
    const newUser = new User({
      name,
      idNumber,
      accountNumber,
      email,
      password: hashedPassword,
      role: role || "customer",
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Register error:", err);

    if (err.code === 11000) {
      // Handle duplicate email or ID
      const duplicateField = Object.keys(err.keyValue)[0];
      return res
        .status(400)
        .json({ message: `Duplicate ${duplicateField} detected` });
    }

    res.status(500).json({ message: "Server error during registration" });
  }
});

   //Login: Handles both customers and employees.

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const roleLower = role?.toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    let account;

    // Employee login
    if (roleLower === "employee") {
      account = await Employee.findOne({ email: normalizedEmail });
    } 
    // Customer login
    else {
      account = await User.findOne({ email: normalizedEmail });
    }

    console.log("Looking for user:", normalizedEmail);
    console.log("Found account:", account ? account.email : "None");

    // Handle missing user
    if (!account) {
      return res.status(401).json({ message: "User not found" });
    }

    // Ensure role consistency
    const dbRole = account.role ? account.role.toLowerCase() : null;
    if (roleLower && dbRole && roleLower !== dbRole) {
      return res.status(403).json({ message: `Access denied for role: ${role}` });
    }

    // Compare password (try both methods: with and without PEPPER)
    let isMatch = await bcrypt.compare(password + process.env.PEPPER, account.password || "");
    if (!isMatch) {

    // fallback for employees or older hashes
      isMatch = await bcrypt.compare(password, account.password || "");
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: account._id, email: account.email, role: dbRole || account.role || roleLower },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: account._id,
        name: account.name || account.fullName,
        email: account.email,
        role: dbRole || account.role || roleLower,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;

/* References
stripe, 2025. International payments 101: What they are and how they work. [Online] 
Available at: https://stripe.com/resources/more/international-payments-101-what-they-are-and-how-they-work
[Accessed 02 October 2025]. 
*/

