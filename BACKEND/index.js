/**
 * -----------------------------------------------------------------------------
 * 1. Purpose:
 *    This file configures and launches the main Express server with:
 *      - Secure HTTP headers (Helmet)
 *      - Rate limiting for authentication routes
 *      - MongoDB connection
 *      - Centralized error handling
 *      - Socket.IO real-time communication
 *      - Parsing & logging middleware
 *
 * 2. Security Features:
 *    - Helmet with secure defaults (Prevents XSS, clickjacking, MIME sniffing)
 *    - Strict CORS (origin restricted to FRONTEND_URL in production)
 *    - Rate limiting added to prevent brute-force login attempts
 *    - Enforces JSON parsing limits to prevent payload attacks
 *    - Centralized sanitized error responses
 *
 * 3. Application Structure:
 *    - /api/auth         → Authentication Routes
 *    - /api/attendence   → Attendance Routes
 *    - Socket.IO         → Real-time connection events
 *
 * 4. Notes:
 *    - Make sure `.env` contains PORT, MONGO_URI, JSON_SECRET_KEY, FRONTEND_URL
 *    - Use HTTPS + Proxy reverse server (Nginx) in production
 * -----------------------------------------------------------------------------
 */
import express from "express";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "node:path";
import { fileURLToPath } from "url";
import "colors";

import router from "./router/authRouter.js";
import attenRouter from "./router/attenRouter.js";
import combineRouter from "./router/combineRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// -----------------------------------------------------------------------------
// Global Middleware
// -----------------------------------------------------------------------------

app.use(
  helmet({
    contentSecurityPolicy: false, // Adjust if serving inline scripts
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json({ limit: "10kb" }));          
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));                       

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "*",
    credentials: true,
  })
);

// Connect to DB
connectDB();

// -----------------------------------------------------------------------------
// Rate Limiting — specific to authentication routes
// -----------------------------------------------------------------------------
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { success: false, message: "Too many attempts. Try again later.", },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter for auth endpoints
app.use("/api/auth", authLimiter);

// -----------------------------------------------------------------------------
// API Routes
// -----------------------------------------------------------------------------
app.use("/api/auth", router);
app.use("/api/attendence", attenRouter);
app.use("/api/combine", combineRouter);

// -----------------------------------------------------------------------------
// Socket.IO Configuration
// -----------------------------------------------------------------------------
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "*", },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`.yellow);

  socket.on("disconnect", () => { console.log(`Socket disconnected: ${socket.id}`.red); });
});

// -----------------------------------------------------------------------------
// Centralized Error Handler
// -----------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack.red);

  // Known client error
  if (err.isClientError) { return res.status(err.status || 400).json({ success: false, message: err.message, }); }

  // Unknown server error
  return res.status(500).json({ success: false, message: "Internal Server Error", });
});

// -----------------------------------------------------------------------------
// Start Server
// -----------------------------------------------------------------------------
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => { console.log(`🔥 Server running on port ${PORT}`.green); });
