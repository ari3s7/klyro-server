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
};

export async function getAttachment(messageId: string, userId: string){
    const message = await prisma.message.findUnique({
        where : {
            id: messageId,
        },
    });

    if(!message){
        throw new ApiError(404, "Message not found")
    };

    const channel = await prisma.channel.findUnique({
        where: {
            id: message.channelId,
        },
    });

    if(!channel){
        throw new ApiError(404, "Channel not found")
    };

    const member = await prisma.serverMember.findUnique({
        where: {
            serverId_userId: {
                serverId: channel.serverId,
                userId,
            },
        },
    });

    if(!member) {
        throw new ApiError(403, "You are not the member of the server")
    };

    const attachment = await prisma.attachment.findFirst({
        where: {
            messageId,
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