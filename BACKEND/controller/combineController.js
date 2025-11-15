// 1. `registerCombineData`: Controller to register a new combine machine entry.
// 2. `req, res`: Express.js request/response objects.
// 3. Extracts: `model, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state` from request body.
// 4. Validation: Ensures required fields (`model, engineNo, doS, state`) are present; returns 400 if missing.
// 5. Duplicate Check: Ensures no existing record with the same `engineNo`, `chassisNo`, or `fipNo`; returns 409 if conflict found.
// 6. Record Creation: Creates a new record in `CombineModel` using sanitized and validated data.
// 7. Saving Data: Saves the newly created combine record to MongoDB.
// 8. Response: Returns success message with essential stored data.
// 9. Error Handling: Returns a 500 server error if something unexpected happens.

import CombineModel from "../models/combineModel";
export const registerCombineData = async (req, res) => {
    try {
        const { model, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state } = req.body;
        if (![model, engineNo, doS, state].every(Boolean)) return res.status(400).json({ success: false, message: "model, engineNo, doS and state are required." });

        const existing = await CombineModel.findOne({ $or: [{ engineNo }, { chassisNo }, { fipNo }] });
        if (existing) return res.status(409).json({ success: false, message: "Duplicate entry found for engineNo, chassisNo, or fipNo." });

        const newRecord = await CombineModel.create({
            model,
            engineNo,
            chassisNo,
            fipNo,
            doS,
            customerName,
            dealerName,
            state
        });

        res.status(201).json({ success: true, message: "Combine data registered successfully.", data: { id: newRecord._id, model: newRecord.model, engineNo: newRecord.engineNo } });

    } catch (error) {
        console.error("Error registering combine:", error);
        res.status(500).json({ success: false, message: "Server error occurred while registering combine data." });
    }
};
