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
import attenRouter from './router/attenRouter.js';

// Load environment variables
dotenv.config();

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url); // Current file path
const __dirname = path.dirname(__filename); // Directory name

// Initialize Express app
const app = express();

// Middlewares
app.use(helmet()); // Adds security headers to the app
app.use(express.json()); // Middleware for parsing JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies
app.use(morgan("combined")); // HTTP request logger
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS)

// Connect to MongoDB database
connectDB();

// Rate Limiting for /api/auth/*
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Max 5 requests per 10 minutes
  message: "Too many requests from this IP, please try again later.",
  keyGenerator: (req) => req.ip, // Rate limit by IP address
});

// Apply rate limiter only on /api/auth routes
app.use("/api/auth", authLimiter);

// Apply routes
app.use("/api/auth", router); // Authentication routes
app.use("/api/attendence", attenRouter); // Attendance routes

// Socket.IO real-time communication setup
const server = createServer(app); // Create HTTP server for socket.io

// Dynamic origin for CORS, defaults to all if not set
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL || "*", }, });

// Socket.IO connection event
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);
  socket.on("disconnect", () => { console.log("Client disconnected: ", socket.id); });
});

// Centralized error handler for catching async errors and unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack trace for debugging

  // If the error is client-side related, send a 400/4xx status
  if (err.isClientError) { res.status(err.status || 400).json({ success: false, message: err.message }); }

  // For server-side errors, send a 500
  else { res.status(500).json({ success: false, message: "Internal Server Error" }); }
});

// Start the server
const PORT = process.env.PORT || 8080; // Default port is 8080 if not specified in the .env
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.green);
});
