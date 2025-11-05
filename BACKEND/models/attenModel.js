import mongoose from "mongoose";
import { type } from "node:os";

const attendSchema = new mongoose.Schema({
    empCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    engineNo: {type: [String], required: true},
    contact: { type: Number, },
    Location: { type: [String], required: true, },
    state: { type: [String], required: true },
    date:{type: [Date], required: true}
},
    { timestamps: true });

const DailyAttendence = mongoose.model("DailyAttendence", attendSchema);
export default DailyAttendence;