// 1. Import mongoose: Import the mongoose library to define the schema and interact with MongoDB.
// 2. Define attendSchema: Defines a schema for daily attendance with fields such as empCode, name, engineNo, contact, etc.
//    - empCode: Required, unique employee code (string).
//    - name: Required employee name (string).
//    - engineNo: Array of required engine numbers (array of strings).
//    - contact: Optional contact numbers (array of strings).
//    - Location: Required array of location names (array of strings), trimmed of extra spaces.
//    - state: Required array of state names (array of strings).
//    - date: Required array of date strings.
//    - problem: Required array of problem descriptions (array of strings).
// 3. Timestamps: `{ timestamps: true }` automatically adds `createdAt` and `updatedAt` fields to each document.
// 4. Create DailyAttendence Model: The model is created using the `attendSchema` and mapped to the "DailyAttendence" collection in MongoDB.
// 5. Export Model: The `DailyAttendence` model is exported for use in other files for database operations.

import mongoose from "mongoose";

const attendSchema = new mongoose.Schema({
    empCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    engineNo: { type: [String], required: true },
    contact: { type: [String] },
    Location: { type: [String], required: true, trim: true },
    state: { type: [String], required: true },
    date: { type: [String], required: true },
    problem: { type: [String], required: true }
}, { timestamps: true });

export default mongoose.model("DailyAttendence", attendSchema);
