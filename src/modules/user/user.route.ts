import Router from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getUserProfileController, updateUserProfileController } from "./user.controller.js";

const router = Router();

router.get("/users/:userId", authenticate, getUserProfileController);
router.patch("/users/me", authenticate, updateUserProfileController);

export default router;