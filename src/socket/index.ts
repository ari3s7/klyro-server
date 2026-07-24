import http from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./handlers.js";
import { setIO } from "./socket.js";

export function initializeSocket(server: http.Server){
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    registerSocketHandlers(io);
    setIO(io);

    return io;
}