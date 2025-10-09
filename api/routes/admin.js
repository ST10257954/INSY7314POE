import express from "express";
import Payment from "../models/Payment.js";
import authEmployee from "../middleware/authEmployee.js"; // You’ll create this if not done

const router = express.Router();

// Get all pending payments (staff view)
router.get("/pending", authEmployee, async (req, res) => {
  const payments = await Payment.find({ status: "PENDING" }).populate("userId", "fullName email");
  res.json(payments);
});

// Verify a payment
router.put("/verify/:id", authEmployee, async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status: "VERIFIED", updatedAt: new Date() },
    { new: true }
  );
  res.json({ message: "Payment verified", payment });
});

// Submit verified payment to SWIFT
router.put("/submit/:id", authEmployee, async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { status: "SUBMITTED_TO_SWIFT", updatedAt: new Date() },
    { new: true }
  );
  console.log(`SWIFT transfer submitted for ${payment.beneficiaryAcc}`);
  res.json({ message: "Payment submitted to SWIFT", payment });
});

export default router;
