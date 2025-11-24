// 1. Import mongoose: Import the mongoose library to define and manage MongoDB schemas and models.
// 2. Define CombineScheme: Schema for storing combine data with fields like model, engineNo, chassisNo, and others.
// 3. model: A required string for the combine model.
// 4. engineNo: Required and unique string for the engine number of the combine.
// 5. chassisNo: A unique string for the chassis number (optional).
// 6. doS: Required field for Date of Sale (type Date).
// 7. customerName: Optional string with trim to store customer name.
// 8. dealerName: Optional string with trim for dealer name.
// 9. state: Required field to specify the state of the combine.
// 10. timestamps: Adds createdAt and updatedAt fields automatically.
// 11. Create CombineModel: Creates the model from the schema for CRUD operations in MongoDB.
// 12. Export CombineModel: Makes the model available for use in other files.

import mongoose from "mongoose";

const CombineScheme = new mongoose.Schema({
    model: { type: String, required: true },
    engineNo: { type: String, required: true, unique: true },
    chassisNo: { type: String, required: true},
    fipNo: { type: String},
    doS: { type: Date, required: true }, // Date of Sale
    customerName: { type: String, trim: true },
    dealerName: { type: String, trim: true },
    state: { type: String,}
}, { timestamps: true });

CombineScheme.pre('save', function (next) {
    if (this.doS) {
        const date = new Date(this.doS);
        date.setHours(0, 0, 0, 0);
        this.doS = date;
    }
    next();
});

const CombineModel = mongoose.model("CombineData", CombineScheme);
export default CombineModel;
