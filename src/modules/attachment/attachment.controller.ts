import type{Request, Response} from 'express';
import { messageIdSchema } from '../message/message.validator.js';
import { attachmentSchema } from './attachment.validator.js';
import { sendAttachment } from './attachment.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export async function sendAttachmentController(req: Request, res: Response){
   const { messageId } = messageIdSchema.parse(req.params);
   const userId = req.user!.id;

   const data = attachmentSchema.parse(req.body);

   const attachment = await sendAttachment(messageId, userId, data);

   return res.status(201).json(
    new ApiResponse(true, "Attachment attached", attachment)
   );
};