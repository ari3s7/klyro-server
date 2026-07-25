import { Server } from "socket.io";

const onlineSockets = new Set<string>();

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    onlineSockets.add(socket.id);             
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
    socket.on("disconnect", () => {
       io.emit("online-count", onlineSockets.size);
       onlineSockets.delete(socket.id);
      console.log("Disconnected:", socket.id);
      
    });
  });
}