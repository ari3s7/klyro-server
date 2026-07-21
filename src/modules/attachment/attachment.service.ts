import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { AttachmentSchemaInput } from "./attachment.validator.js";


export async function sendAttachment(messageId: string, userId: string, data: AttachmentSchemaInput) {
    const message = await prisma.message.findUnique({
        where: {
            id: messageId,
        },
    });

    if(!message){
        throw new ApiError(404, "Message not found")
    }

    if(message.senderId !== userId){
        throw new ApiError(403, "You can only attach files to your own messages")
    };

    const existingAttachment = await prisma.attachment.findFirst({
    where: {
        messageId,
        },
    });

    if (existingAttachment) {
        throw new ApiError(409, "This message already has an attachment");
    }

    const attachment = await prisma.attachment.create({
        data: {
            messageId,
            url: data.url,
            fileName: data.fileName,
            mimeType: data.mimeType,
            size: data.size,
        }, select : {
            id: true,
            url: true,
            fileName: true,
            mimeType: true,
            size: true,
        },
    });

    return attachment;
}