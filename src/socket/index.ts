import http from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./handlers.js";

export function initializeSocket(server: http.Server){
    const io = new Server(server, {
        cors: {
            origin: " "
        },
    });

    registerSocketHandlers(io);

    return io;
}