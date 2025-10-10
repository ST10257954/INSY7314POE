import "dotenv/config";
import fs from "fs";
import https from "https";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import app from "./app.js";
import paymentsRoute from "./routes/payments.js";

/* ✅ FIXED: Full CORS Handling */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // ✅ Handle preflight requests properly
  console.log("🔎 Preflight received for:", req.path);
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No content; OK
  }
  next();
});

/* ✅ Optional but safe to keep CORS package after manual headers */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ Ensure routes are registered AFTER CORS */
app.use("/v1/payments", paymentsRoute);

const HTTP_PORT = 3001;
const HTTPS_PORT = 3443;

const sslOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

const redirectApp = (req, res) => {
  const host = req.headers.host?.replace(/:\d+$/, `:${HTTPS_PORT}`);
  res.writeHead(301, { Location: `https://${host}${req.url}` });
  res.end();
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      console.log(`🔒 HTTPS running on https://localhost:${HTTPS_PORT}`);
    });

    http.createServer(redirectApp).listen(HTTP_PORT, () => {
      console.log(`↪️ HTTP (${HTTP_PORT}) redirecting to HTTPS`);
    });
  } catch (err) {
    console.error("❌ Mongo error:", err.message);
    process.exit(1);
  }
})();
