import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { MessageInput } from "./message.validator.js";
import { getIO } from "../../socket/socket.js";


export async function sendMessage(channelId: string, userId: string, data: MessageInput) {
    const channel = await prisma.channel.findUnique({
        where: {
            id: channelId,
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

    if(!member){
        throw new ApiError(403, "You are not the member of this server")
    };

    const message = await prisma.message.create({
        data: {
            channelId,
            senderId: userId,
            content: data.content,
            type: "TEXT",
        },
        select : {
            id: true,
            content: true,
            createdAt: true,
            sender: {
                select : {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
        },
    });

    getIO().to(channelId).emit("message-created", message);

    return message;
};

export async function getMessages(channelId: string, userId: string){
    const channel = await prisma.channel.findUnique({
        where: {
            id: channelId,
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

    if(!member){
        throw new ApiError(403, "You are not the member of this server")
    };

    const messages = await prisma.message.findMany({
        where: {
            channelId,
        },
        orderBy: {
            createdAt: "asc"
        }, select : {
            id: true,
            content: true,
            createdAt: true,
            isEdited: true,
            sender : {
                select : {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
        },
    });
    return messages;
}

export async function updateMessage(messageId: string, userId: string, data: MessageInput){
    const message = await prisma.message.findUnique({
        where: {
            id: messageId,
        },
    });

    if(!message){
        throw new ApiError(404, "Message not found")
    };

    if(userId !== message.senderId){
        throw new ApiError(403, "You can't edit this message")
    };

    const update = await prisma.message.update({
        where: {
            id: messageId,
        }, data: {
           content: data.content,
           isEdited: true
        }, select: {
          id: true,
          content: true,
          createdAt: true,
          isEdited: true,
          sender : {
            select: {
                id: true,
                username: true,
                avatar: true,
            },
          },
        },
    });

    return update;
};

export async function deleteMessage(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({
        where: {
            id: messageId,
        },
    });

    if(!message){
        throw new ApiError(404, "Message not found")
    };

    if(message.senderId !== userId){
        throw new ApiError(403, "You can't delete the message")
    };

    await prisma.message.delete({
        where: {
            id: messageId,
        },
    });
}