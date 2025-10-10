// Database Config: Establishes a secure MongoDB connection for the International payment system project (Victoria, 2023).
import mongoose from "mongoose";

export async function connectDB(uri) {
// Enforce strict query mode and connect to the database
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName: "insy7314" });
  console.log("Mongo connected");
}

/* References
Victoria, A., 2023. MongoDB Collections – A Complete Guide and Tutorial. [Online] 
Available at: https://studio3t.com/knowledge-base/articles/mongodb-collections-a-complete-guide-and-tutorial/
[Accessed 14 June 2024].
*/
