// 1. Import Express, controllers, and middleware
// 2. Create Express router instance
// 3. Routes mapping
// 3a. User registration
// 3b. User login
// 3c. Admin login
// 3d. Admin registration
// 3e. Protected test route (requires authentication)
// 4. Export router for main app

import express from "express";
import {
    textController,
    registerController,
    loginController,
    adminController,
    adminregController
} from "../controller/authController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register-user', registerController);

router.post('/login-user', loginController);

router.post('/login-admin', adminController);

router.post('/register-admin', adminregController);

router.get('/protected', requireSignIn, textController);

export default router;
