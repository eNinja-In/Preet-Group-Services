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
import router from "./router/authRouter.js"


dotenv.config(); // Load .env

const __filename = fileURLToPath(import.meta.url); // Current file path
const __dirname = path.dirname(__filename);

const app = express(); // Express app

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(cors());
connectDB();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many requests from this IP, please try again later.",
});

app.set("trust proxy", 10);

app.use(limiter); // Apply rate limiter
app.use("/api/auth", router);


const server = createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 8080; // Set port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
