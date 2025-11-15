// 1. Import Express and attendance controller functions
// 2. Create Express router instance
// 3. Routes mapping
// 3a. Register/update attendance for an existing employee
// 3b. Register attendance for a new employee
// 3c. Fetch attendance records
// 4. Export router for main app

import express from "express";
import { regAttndence, newAttndence, fetchAttendence } from "../controller/attenController.js";

const router = express.Router();

router.post('/register', regAttndence);

router.post('/new-attendance', newAttndence);

router.post('/fetch-attendence', fetchAttendence);

export default router;
