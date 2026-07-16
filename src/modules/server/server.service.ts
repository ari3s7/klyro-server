import { ChannelType } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
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