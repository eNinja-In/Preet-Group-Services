import express from "express"; 
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


dotenv.config(); // Load .env

const __filename = fileURLToPath(import.meta.url); // Current file path
const __dirname = path.dirname(__filename);


const app = express(); // Express app

app.get('/', (req, res) => {
  res.send('Hello World');
});

const server = createServer(app);
// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("combined"));
app.use(cors());
connectDB();


const PORT = process.env.PORT || 8080; // Set port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
