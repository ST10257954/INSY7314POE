// Server Entry: Configures HTTPS/HTTP servers, connects MongoDB, and enables secure CORS handling (Victoria, 2023).

import "dotenv/config";
import fs from "fs";
import https from "https";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import app from "./app.js";
import paymentsRoute from "./routes/payments.js";

// Manual CORS configuration for secure frontend access 
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

  // Handle preflight requests
  console.log("Preflight received for:", req.path);
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); 
  }
  next();
});

// CORS package (extra safety layer)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Register routes after CORS setup
app.use("/v1/payments", paymentsRoute);

const HTTP_PORT = 3001;
const HTTPS_PORT = 3443;

// Load SSL certificates for HTTPS
const sslOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

// Redirect HTTP traffic to HTTPS 
const redirectApp = (req, res) => {
  const host = req.headers.host?.replace(/:\d+$/, `:${HTTPS_PORT}`);
  res.writeHead(301, { Location: `https://${host}${req.url}` });
  res.end();
};

// Connect to MongoDB and start secure servers

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
      console.log(`HTTPS running on https://localhost:${HTTPS_PORT}`);
    });

    http.createServer(redirectApp).listen(HTTP_PORT, () => {
      console.log(`HTTP (${HTTP_PORT}) redirecting to HTTPS`);
    });
  } catch (err) {
    console.error(" Mongo error:", err.message);
    process.exit(1);
  }
})();

/*References
Victoria, A., 2023. MongoDB Collections – A Complete Guide and Tutorial. [Online] 
Available at: https://studio3t.com/knowledge-base/articles/mongodb-collections-a-complete-guide-and-tutorial/
[Accessed 14 June 2024].
 */