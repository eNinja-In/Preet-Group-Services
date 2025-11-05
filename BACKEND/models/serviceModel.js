import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    engineNo: { type: String, required: true, unique: true },
    // chassisNo: { type: String, unique: true, required: false }, // If it's optional, remove required: true
    location: { type: [String], trim: true },
    state: { type: String, required: true },
    foreman: { type: [String], required: true }, // Array of strings for foreman list
    problem: { type: [String], required: true }, // Array of strings for foreman list
    doP:{type: [Date], required: true}
},
    { timestamps: true }
);

// Create and export the UserModel
const ServiceModel = mongoose.model("ServiceData", serviceSchema);
export default ServiceModel;
