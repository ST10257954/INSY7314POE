import mongoose from "mongoose";
export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "insy7314" });
  console.log("Mongo connected");
}
