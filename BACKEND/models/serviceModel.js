// 1. Import mongoose: Imports mongoose to define the schema and model.
// 2. Define `ss` schema: A schema for service data containing fields:
//    - `engineNo`: Required string for the engine number.
//    - `location`: An array of strings for the locations, trimmed of extra spaces.
//    - `state`: Required string for the state.
//    - `foreman`: An array of strings for the foreman list, required.
//    - `problem`: An array of strings to store problems, required.
//    - `doP`: An array of dates representing the service date, required.
// 3. Timestamps: Adds `createdAt` and `updatedAt` fields automatically to the schema.
// 4. Model Creation: `ServiceData` model is created from `ss` schema and exported for use in the app.

import mongoose from "mongoose";

const ss = new mongoose.Schema({
    engineNo: { type: String, required: true },
    location: { type: [String], trim: true },
    state: { type: String, required: true },
    foreman: { type: [String], required: true },
    problem: { type: [String], required: true },
    doP: { type: [Date], required: true }
}, { timestamps: true });

export default mongoose.model("ServiceData", ss);
