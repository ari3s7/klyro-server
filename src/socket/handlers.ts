import { Server } from "socket.io";
import { socketAuthMiddleware } from "./authMiddleware.js";
import { prisma } from "../lib/prisma.js";
import {
  addParticipant,
  removeParticipant,
  getParticipants,
  removeSocketFromAllChannels,
} from "./voiceState.js";

const onlineSockets = new Set<string>();

export function registerSocketHandlers(io: Server) {
  io.use(socketAuthMiddleware);
  io.on("connection", async (socket) => {
    console.log("Authenticated user connected:", socket.data.userId);

    onlineSockets.add(socket.id);
    await prisma.user.update({
  where: { id: socket.data.userId },
  data: { isOnline: true },
});
  io.emit("user-status-changed", { userId: socket.data.userId, isOnline: true });             
  io.emit("online-count", onlineSockets.size); 

    socket.on("join-channel", (channelId: string) => {
        console.log(`${socket.id} joined ${channelId}`);
      socket.join(channelId);

      console.log(`${socket.id} joined ${channelId}`);
    });

    socket.on("leave-channel", (channelId: string) => {
      socket.leave(channelId);

      console.log(`${socket.id} left ${channelId}`);
    });

    socket.on(
      "typing-start",
      ({ channelId, username }) => {
        console.log("Typing:", username, channelId);
    socket.to(channelId).emit("typing-start", {
      username,
    });
  }
);
    socket.on(
     "typing-stop",
     ({ channelId, username }) => {
    socket.to(channelId).emit("typing-stop", {
      username,
    });
  }
);

socket.on("request-online-count", () => {
  socket.emit("online-count", onlineSockets.size);
});


    socket.on("join-voice-channel", async (channelId: string) => {
      const userId = socket.data.userId;

      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        select: { serverId: true, type: true },
      });

      if (!channel || channel.type !== "VOICE") {
        return socket.emit("voice-error", "Invalid voice channel");
      }

      const membership = await prisma.serverMember.findUnique({
        where: { serverId_userId: { serverId: channel.serverId, userId } },
      });

      if (!membership) {
        return socket.emit("voice-error", "Not a member of this server");
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, avatar: true },
      });

      if (!user) return;

      const existingParticipants = getParticipants(channelId);
      socket.emit("voice-participants", existingParticipants);

      addParticipant(channelId, {
        socketId: socket.id,
        userId,
        username: user.username,
        avatar: user.avatar,
      });
      socket.join(`voice:${channelId}`);

      socket.to(`voice:${channelId}`).emit("peer-joined-voice", {
        socketId: socket.id,
        userId,
        username: user.username,
        avatar: user.avatar,
      });

      console.log(`[voice] ${user.username} joined voice channel ${channelId}`);
    });

    socket.on("leave-voice-channel", (channelId: string) => {
      const userId = socket.data.userId;

      removeParticipant(channelId, userId);
      socket.leave(`voice:${channelId}`);
      socket.to(`voice:${channelId}`).emit("peer-left-voice", { userId, socketId: socket.id });

      console.log(`[voice] ${userId} left voice channel ${channelId}`);
    });

    socket.on("voice-offer", ({ to, offer }: { to: string; offer: any }) => {
      console.log("[server] relaying offer to", to);
      io.to(to).emit("voice-offer", { from: socket.id, offer });
    });

    socket.on("voice-answer", ({ to, answer }: { to: string; answer: any }) => {
      console.log("[server] relaying answer to", to);
      io.to(to).emit("voice-answer", { from: socket.id, answer });
    });

    socket.on("voice-ice-candidate", ({ to, candidate }: { to: string; candidate: any }) => {
      io.to(to).emit("voice-ice-candidate", { from: socket.id, candidate });
    });

    socket.on("disconnect", async () => {
      io.emit("online-count", onlineSockets.size);
      onlineSockets.delete(socket.id);

      const affected = removeSocketFromAllChannels(socket.id);
      for (const { channelId, userId } of affected) {
        socket.to(`voice:${channelId}`).emit("peer-left-voice", { userId, socketId: socket.id });
      }
      await prisma.user.update({
        where: { id: socket.data.userId },
        data: { isOnline: false, lastSeen: new Date() },
    });
    io.emit("user-status-changed", { userId: socket.data.userId, isOnline: false });

      console.log("Disconnected:", socket.id);
    });
  });
}
