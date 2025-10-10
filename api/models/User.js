// Model: Defines registered bank customers for the payments portal (Lange, 2021).
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "customer" },
});

export default mongoose.model("User", userSchema);

/*References
Lange, B., 2021. Effective Javascript Model Design. [Online] 
Available at: https://medium.com/@brandonlostboy/effective-javascript-model-design-3f4a02b83ada
[Accessed 01 October 2025].
 */