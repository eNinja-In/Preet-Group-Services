// 1. Importing Express.js and combine controller functions
// 2. Create Express router instance
// 3. Routes mapping
// 3a. Register new combine data
// 3b. Update existing combine data by engineNo or chassisNo
// 3c. Fetch combine data by engineNo or chassisNo
// 3d. Fetch combine data by date range
// 3e. Fetch all combine data (empty body)
// 4. Export router to use in main app
import express from "express";
import {
    registerCombineData,
    updateCombineData,
    getCombineData,
    getCombineDataByDate,
    getAllCombineData
} from "../controller/combineController.js";

const router = express.Router();

router.post('/register-combine', registerCombineData);

router.put('/update-combine', updateCombineData);

router.post('/get-combine', getCombineData);

router.post('/get-combine-by-date', getCombineDataByDate);

router.get('/get-all-combine', getAllCombineData);

export default router;
