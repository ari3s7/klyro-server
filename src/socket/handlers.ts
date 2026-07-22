import { Server } from "socket.io";

export function registerSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        console.log("Connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.id);
        });
    });
}