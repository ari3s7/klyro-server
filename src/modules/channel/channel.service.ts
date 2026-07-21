import type { StringFormatParams } from "zod/v4/core";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { CreateChannelInput } from "./channel.validator.js";
import type { UpdateServerInput } from "../server/server.validator.js";


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

export async function getChannel(serverId: string, userId: string){
    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
        },
    });

    if(!server){
        throw new ApiError(404, "Server not found")
    };

    const user = prisma.serverMember.findUnique({
        where: {
            id: userId,
        },
    });

    if(!user){
        throw new ApiError(403, "You are not the member of this server")
    }

    const channels = await prisma.channel.findMany({
      where: {
        serverId,
      },
       orderBy: {
        position: "asc",
       },
       select: {
        id: true,
        name: true,
        description: true,
        type: true,
        position: true,
       }
    });

    return channels;
}

export async function updateChannel(channelId: string, userId: string, data: UpdateServerInput) {
    const channel = await prisma.channel.findUnique({
        where: {
            id: channelId,
        },
         include : {
            server : {
                select: {
                    ownerId: true,
                },
            },
         },
    });

    console.log(channel);

    if(!channel){ 
        throw new ApiError(404, "Channel not found")
    }

    if(!channel.server){
        throw new ApiError(404, "Server not found")
    }

    if (channel.server.ownerId !== userId){
        throw new ApiError(403, "Only the server owner can update channel");
    };

    const updateData = Object.fromEntries(
       Object.entries(data).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
       throw new ApiError(400, "Provide at least one field to update");
    }

    const update = await prisma.channel.update({
     where: {
        id: channelId,
     }, 
     data: updateData,
     select: {
        id: true,
        name: true,
        description: true,
        type: true,
        position: true
     }
    });

    return update;
}