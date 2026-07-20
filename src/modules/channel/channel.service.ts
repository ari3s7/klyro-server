import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { CreateChannelInput } from "./channel.validator.js";


export async function createChannel(serverId: string, userId: string, data: CreateChannelInput){
    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
        }
    });

    if(!server){
        throw new ApiError(404, "Server not found");
    };

    if(userId !== server.ownerId){
      throw new ApiError(403, "Only server owner can create the channel");
    };

    const existingChannel = await prisma.channel.findFirst({
        where: {
            serverId,
            name: data.name,
        },
    });

    if(existingChannel){
        throw new ApiError(409, "Channel name already exists");
    };

    const lastChannel = await prisma.channel.findFirst({
        where: {
            serverId,
        },
        orderBy : {
            position: "desc",
        },
    });
    
    const position = lastChannel ? lastChannel.position + 1 : 0;

    const channel = await prisma.channel.create({
       data: {
        serverId,
        name: data.name,
        description: data.description,
        position,
       }
    });
    return channel;
}