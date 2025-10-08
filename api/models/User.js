import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  role:        { type: String, enum: ["customer","staff"], default: "customer" },
  fullName:    { type: String, required: true, minlength: 2, maxlength: 80 },
  idNumber:    { type: String, required: true, unique: true },
  accountNo:   { type: String, required: true, unique: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  passHash:    { type: String, required: true },
  createdAt:   { type: Date, default: Date.now }
}, { versionKey: false });

const User = mongoose.model("User", UserSchema);
export default User;
