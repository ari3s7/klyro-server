import Router from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { getUserProfileController } from "./user.controller.js";

const router = Router();

router.get("/users/:userId", authenticate, getUserProfileController);

export default router;