import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { sendMessageController, getMessageController, updateMessageController } from './message.controller.js';

const router = Router();

router.post("/channel/:channelId/messages", authenticate, sendMessageController);
router.get("/channel/:channelId/messages", authenticate, getMessageController);
router.put("/messages/:messageId", authenticate, updateMessageController);

export default router;