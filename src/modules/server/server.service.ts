import { ChannelType } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { genInviteCode } from "../../utils/inviteCode.js";
import type { CreateServerInput } from "./server.validator.js";

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
                },
    });

    if(!membership){
        throw new ApiError(403, "You are not the member of the server")
    }
     return membership;
}

