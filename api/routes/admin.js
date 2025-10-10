// Route: Handles employee access to pending payments, verification, and SWIFT submission (stripe, 2025).

import express from "express";
import Payment from "../models/Payment.js";
import authEmployee from "../middleware/authEmployee.js"; 

const router = express.Router();

// Get all pending payments (employee view)
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

/* References
stripe, 2025. International payments 101: What they are and how they work. [Online] 
Available at: https://stripe.com/resources/more/international-payments-101-what-they-are-and-how-they-work
[Accessed 02 October 2025]. 
*/
