import express from "express";
import {
    registerDispatch,
    updateDispatchByEmpCode,
    getDispatchByEmpCode,
    getDispatchByDate,
    getAllDispatchRecords,
    deleteMaterialFromDispatch
} from "../controller/dispatchController.js";

const router = express.Router();

router.post('/register-dispatch', registerDispatch);

router.put('/update-dispatch/:empCode', updateDispatchByEmpCode);

router.get('/dispatch/:empCode', getDispatchByEmpCode);

router.get('/dispatch/date', getDispatchByDate);

router.get('/dispatch/all', getAllDispatchRecords);

router.delete('/dispatch/:empCode/material/:materialName', deleteMaterialFromDispatch);

export default router;
