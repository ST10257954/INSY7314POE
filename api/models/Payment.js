// Model: Stores customer international payment details and transaction status (Lange, 2021).

import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId:          { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
  amountCents:     { type: Number, required: true, min: 1 },
  currency:        { type: String, enum: ["ZAR","USD","EUR","GBP"], required: true },
  provider:        { type: String, enum: ["SWIFT", "SEPA", "ACH"], required: true },
  beneficiary:     { type: String, required: true, minlength: 2, maxlength: 80 },
  beneficiaryAcc:  { type: String, required: true },
  swiftCode:       { type: String, required: false, default: "N/A" }, // Makes swiftCode optional
  status:          { type: String, enum: ["PENDING","VERIFIED","SUBMITTED_TO_SWIFT"], default: "PENDING" },
  createdAt:       { type: Date, default: Date.now },
  updatedAt:       { type: Date, default: Date.now }
}, { versionKey: false });

// Update timestamp before saving
PaymentSchema.pre("save", function(next){
  this.updatedAt = new Date();
  next();
});

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;

/*References
Lange, B., 2021. Effective Javascript Model Design. [Online] 
Available at: https://medium.com/@brandonlostboy/effective-javascript-model-design-3f4a02b83ada
[Accessed 01 October 2025].
 */