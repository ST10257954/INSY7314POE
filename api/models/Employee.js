// Model: Defines employee accounts with password hashing for secure login (Lange, 2021).

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "employee" },
});

// Hash password before saving to the DB
employeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("Employee", employeeSchema);

/*References
Lange, B., 2021. Effective Javascript Model Design. [Online] 
Available at: https://medium.com/@brandonlostboy/effective-javascript-model-design-3f4a02b83ada
[Accessed 01 October 2025].
 */