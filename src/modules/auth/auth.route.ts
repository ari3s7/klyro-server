import { Router } from 'express';
import { loginUser, registerUser, refreshAccessToken, getCurrentUser, logoutUser, verifyEmailController } from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { sendEmail } from '../../email/email.service.js';



const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.get("/me", authenticate, getCurrentUser);
router.post("/logout", logoutUser);
router.get("/verify-email", verifyEmailController);

export default router;