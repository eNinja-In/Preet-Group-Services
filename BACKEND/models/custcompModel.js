// Temp
// 1. Import mongoose: Imports the mongoose library for defining the schema and model.
// 2. Define ccs schema: Shortened variable name for "customerComplaintSchema". Defines fields such as engineNo, chassisNo, customerName, etc.
//    - engineNo: Required and unique field for engine number.
//    - chassisNo: Unique and trimmed field for chassis number.
//    - customerName: Optional field for customer name, trimmed of spaces.
//    - contact: Required and trimmed field for contact information.
//    - location: Optional, trimmed field for location of the combine.
//    - problem: Required field for describing the problem with the combine.
// 3. Timestamps: Adds automatic `createdAt` and `updatedAt` fields.
// 4. Model: Creates and exports the `customerComplaintData` model using the `ccs` schema.


import mongoose from "mongoose";

const custCompSch = new mongoose.Schema({
    engineNo: { type: String, required: true, unique: true },
    chassisNo: { type: String, unique: true, trim: true },
    customerName: { type: String, trim: true },
    contact: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    // ipAdr: { type: String, trim: true },
    problem: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("custCompData", custCompSch);