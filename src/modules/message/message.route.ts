import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { sendMessageController, getMessageController } from './message.controller.js';

const router = Router();

router.post("/channel/:channelId/messages", authenticate, sendMessageController);
router.get("/channel/:channelId/messages", authenticate, getMessageController);

export default router;