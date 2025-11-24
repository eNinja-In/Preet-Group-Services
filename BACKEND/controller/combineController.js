// 1. `registerCombineData`: Controller to register a new combine machine entry.
// 2. `req, res`: Express.js request/response objects.
// 3. Extracts: `model, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state` from request body.
// 4. Validation: Ensures required fields (`model, engineNo, doS, state`) are present; returns 400 if missing.
// 5. Duplicate Check: Ensures no existing record with the same `engineNo`, `chassisNo`, or `fipNo`; returns 409 if conflict found.
// 6. Record Creation: Creates a new record in `CombineModel` using sanitized and validated data.
// 7. Saving Data: Saves the newly created combine record to MongoDB.
// 8. Response: Returns success message with essential stored data.
// 9. Error Handling: Returns a 500 server error if something unexpected happens.

import CombineModel from "../models/combineModel.js";

export const registerCombineData = async (req, res) => {
    try {
        const { model, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state } = req.body;
        if (![model, engineNo, fipNo, doS].every(Boolean)) return res.status(400).json({ success: false, message: "Model, EngineNo, FIP No and Date Of Sale Required." });

        const existing = await CombineModel.findOne({ $or: [{ engineNo }] });
        if (existing) {
            console.log(`❌ Duplicate Data Entered engineNo: → ${existing.engineNo}, chassisNo: → ${existing.chassisNo}, or fipNo: → ${existing.fipNo} `.bgRed.white)
            return res.status(409).json({ success: false, message: `Duplicate entry found for engineNo: → ${engineNo}, chassisNo: → ${chassisNo}, or fipNo: → ${fipNo}` });
        }

        const newRecord = await CombineModel.create({ model, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state });

        res.status(201).json({ success: true, message: "Combine data registered", data: { id: newRecord._id, model: newRecord.model, engineNo: newRecord.engineNo } });
        console.log(`✅ Combine register Successfully : ${newRecord.engineNo}`.green);

    } catch (error) {
        console.error("Error registering combine:", error);
        res.status(500).json({ success: false, message: "Server error occurred while registering combine data." });
    }
};


// 1. `updateCombineData`: Controller to update an existing combine machine entry.
// 2. `req, res`: Express.js request/response objects.
// 3. Extracts: all combine fields from request body including identifiers (engineNo or chassisNo).
// 4. Validation: All fields required; returns 400 if any missing.
// 5. Record Lookup: Finds existing record using engineNo OR chassisNo; returns 404 if not found.
// 6. Duplicate Check: Ensures no other record has same engineNo, chassisNo, or fipNo; returns 409 if conflict.
// 7. Record Update: Updates the found record with sanitized and validated data.
// 8. Saving Data: Saves updated record in MongoDB.
// 9. Response: Sends success message with updated essential info.
// 10. Error Handling: Returns 500 if unexpected error occurs.
export const updateCombineData = async (req, res) => {
    try {
        const { model, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state } = req.body;
        if (![model, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state].every(Boolean)) return res.status(400).json({ success: false, message: "All fields are required." });

        const record = await CombineModel.findOne({ $or: [{ engineNo }, { chassisNo }] });
        if (!record) return res.status(404).json({ success: false, message: "No combine record found for provided engineNo or chassisNo." });

        const duplicate = await CombineModel.findOne({
            _id: { $ne: record._id },
            $or: [{ engineNo }, { chassisNo }, { fipNo }]
        });
        if (duplicate) return res.status(409).json({ success: false, message: "Duplicate entry found for engineNo, chassisNo, or fipNo." });

        Object.assign(record, { model, engineNo, chassisNo, fipNo, doS, customerName, dealerName, state });

        const updated = await record.save();
        res.status(200).json({ success: true, message: "Combine data updated successfully.", data: { id: updated._id, model: updated.model, engineNo: updated.engineNo } });
        console.log(`✅ Combine data updated successfully: EngineNo : ${engineNo}, ChasisNo: ${chassisNo}`.green);

    } catch (err) {
        console.error("Error updating combine:", err);
        res.status(500).json({ success: false, message: "Server error occurred while updating combine data." });
    }
};

// 1. `getCombineData`: Controller to fetch a combine machine's complete details.
// 2. `req, res`: Express.js request/response objects.
// 3. Extracts: `engineNo` or `chassisNo` from request body (at least one required).
// 4. Validation: Ensures engineNo or chassisNo is present; returns 400 if missing.
// 5. Record Lookup: Searches for a record using engineNo OR chassisNo; returns 404 if not found.
// 6. Response: Returns full combine record details.
// 7. Error Handling: Returns 500 if unexpected server error occurs.
export const getCombineData = async (req, res) => {
    try {
        const { engineNo, chassisNo } = req.body;

        if (!engineNo) { if (!chassisNo) return res.status(400).json({ success: false, message: "Either engineNo or chassisNo is required to fetch data." }); }

        console.log('Fetching data for:', engineNo, chassisNo);  // Log incoming request

        const record = await CombineModel.findOne({ $or: [{ engineNo }, { chassisNo }] });
        if (!record) { return res.status(404).json({ success: false, message: "No combine record found for provided engineNo or chassisNo." }); }

        res.status(200).json({ success: true, message: "Combine data fetched successfully.", data: record });
        console.log(`✅ Combine Data Fetched Successfully for EngineNo: ${record.engineNo}, ChassisNo: ${record.chassisNo}`.bgGreen);
    } catch (err) {
        console.error("Error fetching combine data:", err);
        res.status(500).json({ success: false, message: "Server error occurred while fetching combine data." });
    }
};




// 1. `getCombineDataByDate`: Controller to fetch combine machine records within a given date range.
// 2. `req, res`: Express.js request/response objects.
// 3. Extracts: `startDate` and `endDate` from the request body.
// 4. Validation: Ensures both dates are provided; returns 400 if missing.
// 5. Database Query: Searches records where `doS` falls within the date range (inclusive).
// 6. Empty Result Check: Returns 404 if no records are found in the range.
// 7. Response: Sends all matching combine records.
// 8. Error Handling: Returns 500 if unexpected server error occurs.

export const getCombineDataByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        if (![startDate, endDate].every(Boolean)) return res.status(400).json({ success: false, message: "startDate and endDate are required." });

        const records = await CombineModel.find({ doS: { $gte: new Date(startDate), $lte: new Date(endDate) } });
        if (!records.length) return res.status(404).json({ success: false, message: "No combine records found in the given date range." });

        res.status(200).json({ success: true, message: "Combine data fetched successfully for the given date range.", data: records, len: records.length });
        console.log(`✅ Combine Data Fetched Succesfully From: ${startDate} To ${endDate}`.green)

    } catch (err) {
        console.error("Error fetching combine data by date range:", err);
        res.status(500).json({ success: false, message: "Server error occurred while fetching combine data by date range." });
    }
};


// 1. `getAllCombineData`: Controller to fetch all combine machine records.
// 2. `req, res`: Express.js request/response objects.
// 3. No data required from request body (empty body allowed).
// 4. Database Query: Fetches all combine records from MongoDB.
// 5. Empty Result Check: Returns 404 if no records exist.
// 6. Response: Sends all stored combine records.
// 7. Error Handling: Returns 500 if unexpected server error occurs.

export const getAllCombineData = async (req, res) => {
    try {
        const records = await CombineModel.find();
        if (!records.length) return res.status(404).json({ success: false, message: "No combine data found." });

        res.status(200).json({ success: true, message: "All combine data fetched successfully.", data: records });
        console.log(`✅ Combine Data Sent Successfully`.bgGreen.white);
    } catch (err) {
        console.error("Error fetching all combine data:", err);
        res.status(500).json({ success: false, message: "Server error occurred while fetching all combine data." });
    }
};
