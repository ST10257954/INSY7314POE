// api/server.js
import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Mongo connected");
  } catch (err) {
    console.error("Mongo connect error:", err?.message || err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
})();
