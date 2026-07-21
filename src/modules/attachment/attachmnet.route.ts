import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { sendAttachmentController } from './attachment.controller.js';

const router =  Router();

router.post("/messages/:messageId/attachments", authenticate, sendAttachmentController);


export default router;