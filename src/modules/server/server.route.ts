import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createServerController, getServerController, getServerContr, joinServerController, leaveServerController, updateServerController } from './server.controller.js';

const router =  Router();

router.post("/", authenticate, createServerController);
router.get("/", authenticate, getServerController);
router.get("/:serverId", authenticate, getServerContr);
router.post("/join", authenticate, joinServerController);
router.post("/leave", authenticate, leaveServerController);
router.put("/:serverId", authenticate, updateServerController);

export default router;