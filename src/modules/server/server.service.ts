import { ChannelType } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { genInviteCode } from "../../utils/inviteCode.js";
import type { CreateServerInput, UpdateServerInput } from "./server.validator.js";

export async function createServer( userId: string, data: CreateServerInput) {
    const inviteCode = genInviteCode();

    return prisma.$transaction(async(tx) => { 
       const server = await tx.server.create({
        data: {    
        name: data.name,
        description: data.description ?? null,
        inviteCode,
        ownerId: userId,
        }
       })

       await tx.serverMember.create({
        data: {
            serverId: server.id,
            userId,
        }
       })

       await tx.channel.create({
        data: {
            serverId: server.id,
            name: "general",
            description: "General discussion",
            type: ChannelType.TEXT,
            position: 0,
        }
       });

       return server;
    });
} 

export async function getMyServers(userId: string) {
    const memberships = await prisma.serverMember.findMany({
        where: {
            userId,
        },
        select: {
            server: {
                select : {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });

    return memberships.map((membership) => membership.server);
}

export async function getServer(serverId: string, userId: string) {
    const servers = await prisma.server.findUnique({
        where: {
            id: serverId,
        }
    });

    if(!servers) {
        throw new ApiError(404, "Server not found")
    };

    const membership = await prisma.serverMember.findUnique({
        where :{
            serverId_userId: {
                serverId,
                userId,
            },
        },
        select: {
            server : { 
                select : {
                    id: true,
                    name: true,
                    description: true,
                    owner : {
                        select : {
                            id: true,
                            username: true,
                        },
                    },
                    channels : {
                        orderBy : {
                            position: "asc",
                        },
                    },
          }  }   },
    });

    if(!membership){
        throw new ApiError(403, "You are not the member of the server")
    }
     return membership;
}

export async function joinServer(inviteCode: string, userId: string) {
    const server = await prisma.server.findUnique({
        where: {
            inviteCode,
        },
    });

    if(!server){
        throw new ApiError(404, "Invalid invite code");
    };

    const existingMember = await prisma.serverMember.findUnique({
        where: {
            serverId_userId : {
                serverId : server.id,
                userId,
            },
        },
    });
    if(existingMember) {
        throw new ApiError(400, "You are already member of this server");
    }
    await prisma.serverMember.create({
        data: {
            serverId: server.id,
            userId
        },
    });

    const joinedServer = await prisma.server.findUnique({
        where: {
            id: server.id,
        },
        select: {
            id: true,
            name: true,
            description: true,
            avatar: true,
            owner : {
                select : {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            channels : {
                select : {
                    id: true,
                    name: true,
                    description: true,
                    type: true,
                    position: true,
                },
            },
        },
        
    });
    console.log(joinedServer);
};

export async function leaveServer(serverId: string, userId: string){
    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
        }
    });

    if(!server){
        throw new ApiError(404, "Server not found");
    }

    const membership = await prisma.serverMember.findUnique({
        where: {
            serverId_userId: {
                serverId,
                userId,
            },
        },
    });

    if(!membership) {
        throw new ApiError(403, "You are not a member of this server");
    };

    if(server.ownerId == userId){
        throw new ApiError(400,  "Server owner cannot leave the server, Delete the server or transfer ownership.");
    }

    await prisma.serverMember.delete({
        where: {
            serverId_userId: {
                serverId,
                userId,
            },
        },
    });

    return null;
}

export async function updateServer(serverId: string, userId: string, data: UpdateServerInput){
    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
        },
    });

    if(!server){
        throw new ApiError(404, "Server not found")
    };

    if(server.ownerId !== userId){
        throw new ApiError(403, "Only the server owner can update the server")
    };

    const updateData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "Provide at least one field to update");
    }
    
    const updatedServer = await prisma.server.update({
        where: {
            id: serverId,
        },
        data: updateData,
        select : {
            id: true,
            name: true,
            description: true,
            avatar: true,
            owner : {
                select : {
                    id: true,
                    username: true,
                },
            },
        },
    });
    return updatedServer;
}

export async function deleteServer (serverId: string, userId: string){
    const server = await prisma.server.findUnique({
        where: {
            id: serverId,
        },
    });

    if(!server){
        throw new ApiError(404, "Server not found")
    };

    if(server.ownerId !== userId){
        throw new ApiError(403, "Only the server owner can delete the server")
    };

    await prisma.server.delete({
        where: {
            id: serverId,
        },
    })
}