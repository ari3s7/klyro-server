import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { deleteAttachmentController, getAttachmentController, sendAttachmentController } from './attachment.controller.js';

const router =  Router();

router.post("/messages/:messageId/attachments", authenticate, sendAttachmentController);
router.get("/messages/:messageId/attachments", authenticate, getAttachmentController);
router.delete("/attachments/:attachmentId", authenticate, deleteAttachmentController);


export default router;