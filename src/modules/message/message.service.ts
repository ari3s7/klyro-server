import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { SendMessageInput } from "./message.validator.js";


export async function sendMessage(channelId: string, userId: string, data: SendMessageInput) {
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
            createdAt: "desc"
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
    return messages
}