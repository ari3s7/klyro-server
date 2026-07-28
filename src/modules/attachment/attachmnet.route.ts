import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { deleteAttachmentController, getAttachmentController, sendAttachmentController, uploadFileController } from './attachment.controller.js';

const router = Router();

router.post("/attachments/upload", authenticate, upload.single("file"), uploadFileController);
router.post("/messages/:messageId/attachments", authenticate, sendAttachmentController);
router.get("/messages/:messageId/attachments", authenticate, getAttachmentController);
router.delete("/attachments/:attachmentId", authenticate, deleteAttachmentController);

export default router;