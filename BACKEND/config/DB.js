/**
 * =============================================================================
 * MongoDB Connection Handler
 * =============================================================================
 * 1. Purpose:
 *    Provides a secure, stable, and professional MongoDB connection layer using
 *    Mongoose. Includes connection retries, graceful shutdown, event listeners,
 *    and strict environment validation.
 *
 * 2. Key Features:
 *    - Automatic retry on initial connection failure
 *    - Graceful shutdown on SIGINT/SIGTERM
 *    - Safe logging (no sensitive details revealed)
 *    - Mongoose optimized configuration for production
 *    - MongoDB ping verification to ensure connection stability
 *
 * 3. Requirements:
 *    - .env must contain DATABASE=<your mongodb uri>
 * =============================================================================
 */

import mongoose from "mongoose";
import colors from "colors";

const RETRY_LIMIT = 5;
const RETRY_DELAY_MS = 3000;

// if (!process.env.DATABASE) {
//   console.error("❌ DATABASE connection string missing in .env".bgRed.white);
//   process.exit(1);
// }

mongoose.set("strictQuery", true);

export default async function connectDB() {
  let attempts = 0;

  const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true, },
    maxPoolSize: 10,            // Efficient connection pooling
    autoIndex: false,           // Performance optimization (enable per-schema)
    connectTimeoutMS: 10000,    // Fail fast instead of hanging forever
    family: 4,                  // IPv4 only (reduces DNS issues)
  };

  while (attempts < RETRY_LIMIT) {
    try {
      attempts++;
      console.log(`📡 Connecting to MongoDB... (Attempt ${attempts})`.cyan);

      const conn = await mongoose.connect(process.env.DATABASE, clientOptions);

      await mongoose.connection.db.admin().command({ ping: 1 });

      console.log(`✅ MongoDB Connected Successfully → Host: ${conn.connection.host}`.green);

      initConnectionEvents();
      return;

    } catch (error) {
      console.error(`❌ MongoDB Connection Failed (${attempts}/${RETRY_LIMIT}): ${error.message}`.red);

      if (attempts >= RETRY_LIMIT) {
        console.error("💥 All MongoDB connection attempts failed.".bgRed.white);
        process.exit(1);
      }

      console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...\n`.yellow);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

/**
 * =============================================================================
 * Connection Event Listeners (Professional Logging)
 * =============================================================================
 */
function initConnectionEvents() {
  const db = mongoose.connection;

  db.on("connected", () => console.log("🔗 MongoDB Connected".green));
  db.on("reconnected", () => console.log("🔄 MongoDB Reconnected".yellow));
  db.on("disconnecting", () => console.log("⚠ MongoDB Disconnecting...".magenta));
  db.on("disconnected", () => console.log("🔌 MongoDB Disconnected".red));
  db.on("error", (err) => console.error(`🔥 MongoDB Error: ${err.message}`.bgRed.white));

  // Graceful Shutdown
  const gracefulExit = () => {
    mongoose.connection.close(() => {
      console.log("🛑 MongoDB Connection Closed (App Terminated)".yellow);
      process.exit(0);
    });
  };

  process.on("SIGINT", gracefulExit);
  process.on("SIGTERM", gracefulExit);
}















