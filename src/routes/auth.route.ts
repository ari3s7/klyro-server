import { Router } from 'express';
import { loginUser, registerUser, refreshAccessToken, getCurrentUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.get("/me", authenticate, getCurrentUser);

export default router;