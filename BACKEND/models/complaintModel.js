// Main Complaint Model
// 1. Import mongoose: The `mongoose` library is imported to define the schema and interact with MongoDB.
// 2. Define `cs` schema: A new schema `cs` is created for storing customer complaint data. The schema defines the following fields:
//    - `engineNo`: A required, unique string to store the engine number.
//    - `chassisNo`: A unique, optional string to store the chassis number, trimmed of any extra spaces.
//    - `customerName`: An optional string for the customer's name, trimmed.
//    - `contact`: A required, trimmed string for the customer's contact number.
//    - `location`: An optional string for the location, trimmed.
//    - `state`: An optional string for the state, trimmed.
//    - `workHr`: An optional string for the work hours, trimmed.
//    - `problem`: A required string to store the complaint/problem description.
// 3. Timestamps: `{ timestamps: true }` automatically adds `createdAt` and `updatedAt` fields to the schema.
// 4. Create and Export Model: `ComplaintData` model is created from the `cs` schema and exported for use in other parts of the application.

import mongoose from "mongoose";

const ComplaintData = new mongoose.Schema({
    engineNo: { type: String, required: true, unique: true },
    chassisNo: { type: String, unique: true, trim: true },
    customerName: { type: String, trim: true },
    contact: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    state: { type: String, trim: true },
    workHr: { type: String, trim: true },
    problem: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("ComplaintData", ComplaintData);
