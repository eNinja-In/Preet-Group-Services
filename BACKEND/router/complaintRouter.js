import express from "express";
import { registerComplaint } from "../controller/complaintController.js";

const router = express.Router();

router.post('/reg-complaint', registerComplaint);
export default router;
