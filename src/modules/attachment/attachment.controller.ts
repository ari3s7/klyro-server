import type{Request, Response} from 'express';
import { messageIdSchema } from '../message/message.validator.js';
import { attachmentIdSchema, attachmentSchema } from './attachment.validator.js';
import { deleteAttachment, getAttachment, sendAttachment } from './attachment.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export async function sendAttachmentController(req: Request, res: Response){
   const { messageId } = messageIdSchema.parse(req.params);
   const userId = req.user!.id;

   const data = attachmentSchema.parse(req.body);

   const attachment = await sendAttachment(messageId, userId, data);

   return res.status(201).json(
    new ApiResponse(true, "Attachment attached", attachment)
   );
};

export async function getAttachmentController(req: Request, res: Response){
    const { messageId } = messageIdSchema.parse(req.params);
    const userId = req.user!.id;

    const attachment = await getAttachment(messageId, userId);

    return res.status(200).json(
        new ApiResponse(true, "Attachment found", attachment)
    );
};

export async function deleteAttachmentController(req: Request, res: Response){
    const { attachmentId } = attachmentIdSchema.parse(req.params);
    const userId = req.user!.id;

    await deleteAttachment(attachmentId, userId);

    return res.status(200).json(
        new ApiResponse(true, "Attachment deleted", null)
    );
};

export async function uploadFileController(req: Request, res: Response) {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const rawPath = (req.file as any).path || (req.file as any).secure_url || "";
  const isCloudinaryUrl = rawPath.startsWith("http://") || rawPath.startsWith("https://");

  const fileUrl = isCloudinaryUrl
    ? rawPath
    : `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  const isVideo = req.file.mimetype.startsWith("video/");

  return res.status(200).json(
    new ApiResponse(true, "File uploaded successfully", {
      url: fileUrl,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      type: isVideo ? "VIDEO" : "IMAGE",
    })
  );
}