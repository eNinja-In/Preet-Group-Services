import DispatchRecord from '../models/dispatchModel.js';
import DailyAttendence from "../models/attenModel.js"; // Importing DailyAttendence model

export const registerDispatch = async (req, res) => {
    try {
        const { empCode, empName, contact, allDispatches } = req.body;
        const existingRecord = await DispatchRecord.findOne({ empCode });

        const existingAttendance = await DailyAttendence.findOne({ empCode });
        if (!existingAttendance) { return res.status(404).json({ msg: 'Invalid empCode. Please check the empCode or try a similar one.', }); }


        if (existingRecord) {
            const updateFields = {
                $push: { allDispatches: { $each: allDispatches } },
                $set: { empName, contact },
            };

            const dispatchRecord = await DispatchRecord.findOneAndUpdate(
                { empCode },
                updateFields,
                { new: true }
            );

            return res.status(200).json({ msg: 'Dispatch record updated with new materials', dispatchRecord, });
        }

        // Step 4: If no dispatch record exists, create a new one
        const newDispatchRecord = new DispatchRecord({ empCode, empName, contact, allDispatches, });

        await newDispatchRecord.save();

        return res.status(201).json({ msg: 'Dispatch record created successfully', dispatchRecord: newDispatchRecord, });

    } catch (error) {
        console.error('Error during dispatch registration/update:', error.message);
        return res.status(500).json({ msg: 'Server error during record operation', error: error.message, });
    }
};


export const updateDispatchByEmpCode = async (req, res) => {
    try {
        const { empCode } = req.params;
        const { empName, contact, allDispatches } = req.body;

        const existingRecord = await DispatchRecord.findOne({ empCode });
        if (!existingRecord) { return res.status(404).json({ msg: 'Invalid empCode. Please check the empCode or try a similar one.', }); }

        const dispatchRecord = await DispatchRecord.findOneAndUpdate(
            { empCode },
            { empName, contact, allDispatches },
            { new: true }
        );

        if (!dispatchRecord) { return res.status(404).json({ msg: 'No dispatch record found for the provided empCode.' }); }

        return res.status(200).json({ msg: 'Dispatch record successfully updated.', dispatchRecord });
    } catch (error) {
        console.error('Error updating dispatch record:', error.message);
        return res.status(500).json({ msg: 'An error occurred while updating the dispatch record. Please try again later.', error: error.message });
    }
};


export const getDispatchByEmpCode = async (req, res) => {
    try {
        const { empCode } = req.params;

        const dispatchRecord = await DispatchRecord.findOne({ empCode });
        if (!dispatchRecord) { return res.status(404).json({ msg: 'No dispatch record found for the provided empCode.' }); }

        return res.status(200).json({ msg: 'Dispatch record retrieved successfully.', dispatchRecord });
    } catch (error) {
        console.error('Error fetching dispatch record:', error.message);
        return res.status(500).json({ msg: 'An error occurred while fetching the dispatch record. Please try again later.', error: error.message });
    }
};


export const getDispatchByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) { return res.status(400).json({ msg: 'Invalid date format' }); }

        const dispatchRecords = await DispatchRecord.find({ 'allDispatches.dispatchDate': { $gte: start, $lte: end }, });

        if (!dispatchRecords.length) { return res.status(404).json({ msg: 'No dispatch records found for the given date range' }); }

        return res.status(200).json({ msg: 'Dispatch records retrieved successfully', dispatchRecords, });
    } catch (error) {
        console.error('Error fetching dispatch records by date:', error.message);
        return res.status(500).json({ msg: 'An error occurred while fetching the dispatch records' });
    }
};


export const getAllDispatchRecords = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'empCode', order = 'asc', filter = '{}' } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const sortOrder = order === 'desc' ? -1 : 1;

        const parsedFilter = JSON.parse(filter); // Safely parse the filter string

        const dispatchRecords = await DispatchRecord.find(parsedFilter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ [sortBy]: sortOrder });

        const totalRecords = await DispatchRecord.countDocuments(parsedFilter);

        return res.status(200).json({ totalRecords, page: pageNum, limit: limitNum, totalPages: Math.ceil(totalRecords / limitNum), dispatchRecords, });
    } catch (error) {
        console.error('Error fetching dispatch records:', error.message);
        return res.status(500).json({ msg: 'An error occurred while fetching the dispatch records.', error: error.message, });
    }
};

export const deleteMaterialFromDispatch = async (req, res) => {
    try {
        const { empCode, materialName } = req.params;

        const dispatchRecord = await DispatchRecord.findOne({ empCode });

        if (!dispatchRecord) { return res.status(404).json({ msg: 'Dispatch record not found for the provided empCode.' }); }

        const materialIndex = dispatchRecord.allDispatches.findIndex((material) => material.name === materialName);

        if (materialIndex === -1) { return res.status(404).json({ msg: 'Material not found in the dispatch record.' }); }

        dispatchRecord.allDispatches.splice(materialIndex, 1);

        await dispatchRecord.save();

        return res.status(200).json({ msg: 'Material successfully removed from dispatch record.', dispatchRecord, });
    } catch (error) {
        console.error('Error removing material from dispatch record:', error.message);
        return res.status(500).json({ msg: 'An error occurred while removing the material.', error: error.message, });
    }
};

