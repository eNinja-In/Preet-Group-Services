import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    model: { type: Number, required: true, minlength: 3 },
    engineNo: { type: String, required: true, unique: true },
    chassisNo: { type: String, unique: true },
    doS: { type: Date, required: true },
    customerName: { type: String },
    dealerName: { type: String },
    location: { type: String, trim: true },
    state: { type: String, required: true },
},
    { timestamps: true });


// Create and export the UserModel
const UserModel = mongoose.model("CombineData", userSchema);
export default UserModel;