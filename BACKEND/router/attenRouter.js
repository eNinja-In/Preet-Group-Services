import express from "express"; 
import { regAttndence, newAttndence,fetchAttendence } from "../controller/attenController.js"; 
const router = express.Router(); 

// Route to register/update attendance for an existing employee
router.post('/register', regAttndence); 

// Route to register a new employee attendance record
router.post('/new-attendance', newAttndence); 
router.post('/fetch-attendence', fetchAttendence); 

// You can uncomment and add more routes as needed:
// router.post('/login-user', loginController);
// router.post('/login-admin', adminController);
// router.post('/register-admin', adminregController);
// router.get('/protected', requireSignIn, textController);

export default router; // Exporting the router
