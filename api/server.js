// api/server.js
import "dotenv/config";
import express from "express";
import fs from "fs";
import https from "https";
import http from "http";
import app from "./app.js";
import { connectDB } from "./db.js";

const HTTP_PORT = process.env.PORT || 3001;
const HTTPS_PORT = 3443;

const sslOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

// Redirect all HTTP traffic to HTTPS
const redirectApp = (req, res) => {
  const host = req.headers.host?.replace(/:\d+$/, `:${HTTPS_PORT}`);
  res.writeHead(301, { Location: `https://${host}${req.url}` });
  res.end();
};

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("✅ Mongo connected");
  } catch (err) {
    console.error("❌ Mongo connect error:", err?.message || err);
    process.exit(1);
  }

  // HTTPS server
  https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`🔒 HTTPS server running on https://localhost:${HTTPS_PORT}`);
  });

  // HTTP redirect server
  http.createServer(redirectApp).listen(HTTP_PORT, () => {
    console.log(`↪️  HTTP (port ${HTTP_PORT}) redirecting to HTTPS`);
  });
})();
