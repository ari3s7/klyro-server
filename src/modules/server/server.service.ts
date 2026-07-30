import { ChannelType, MessageType } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { genInviteCode } from "../../utils/inviteCode.js";
import type { CreateServerInput, UpdateServerInput } from "./server.validator.js";
import { getIO } from "../../socket/socket.js";

async function sendSystemLogMessage(serverId: string, userId: string, content: string) {
    try {
        let generalChannel = await prisma.channel.findFirst({
            where: { serverId, name: "general" },
        });

        if (!generalChannel) {
            generalChannel = await prisma.channel.findFirst({
                where: { serverId, type: ChannelType.TEXT },
            });
        }

        if (!generalChannel) return;

        const message = await prisma.message.create({
            data: {
                channelId: generalChannel.id,
                senderId: userId,
                content,
                type: MessageType.TEXT,
            },
            select: {
                id: true,
                content: true,
                type: true,
                createdAt: true,
                isEdited: true,
                deletedAt: true,
                parentId: true,
                parent: {
                    select: {
                        id: true,
                        content: true,
                        sender: {
                            select: { username: true },
                        },
                    },
                },
                sender: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true,
                    },
                },
                attachments: {
                    select: {
                        id: true,
                        url: true,
                        fileName: true,
                        mimeType: true,
                        size: true,
                    },
                },
            },
        });

        const io = getIO();
        if (io) {
            io.to(generalChannel.id).emit("message-created", message);
        }
    } catch (err) {
        console.error("Failed to send system log message:", err);
    }
}

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
                    inviteCode: true,
                    owner : {
                        select : {
                            id: true,
                            username: true,
                        },
                    },
                    channels: {
                        orderBy: {
                            position: "asc"
                        }
                    }
                },
            },
        },
    });

    return memberships.map((membership) => membership.server);
}

export async function getServerMembers(serverId: string) {
  const memberships = await prisma.serverMember.findMany({
    where: { serverId },
    select: {
      user: {
        select: {
          id: true,
          username: true,
          avatar: true,
          isOnline: true,
          lastSeen: true,
        },
      },
    },
  });

  return memberships.map((membership) => membership.user);
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
                    inviteCode: true,
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

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
    });

    if (user) {
        await sendSystemLogMessage(server.id, userId, `${user.username} joined the server`);
    }

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

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
    });

    await prisma.serverMember.delete({
        where: {
            serverId_userId: {
                serverId,
                userId,
            },
        },
    });

    if (user) {
        await sendSystemLogMessage(serverId, userId, `${user.username} left the server`);
    }

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

export async function kickMember(serverId: string, ownerId: string, targetUserId: string) {
    const server = await prisma.server.findUnique({
        where: { id: serverId },
    });

    if (!server) {
        throw new ApiError(404, "Server not found");
    }

    if (server.ownerId !== ownerId) {
        throw new ApiError(403, "Only the server owner can kick members");
    }

    if (targetUserId === ownerId) {
        throw new ApiError(400, "You cannot kick yourself");
    }

    const membership = await prisma.serverMember.findUnique({
        where: {
            serverId_userId: {
                serverId,
                userId: targetUserId,
            },
        },
    });

    if (!membership) {
        throw new ApiError(404, "User is not a member of this server");
    }

    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { username: true },
    });

    await prisma.serverMember.delete({
        where: {
            serverId_userId: {
                serverId,
                userId: targetUserId,
            },
        },
    });

    if (targetUser) {
        await sendSystemLogMessage(serverId, targetUserId, `${targetUser.username} was kicked from the server`);
    }

    return null;
}