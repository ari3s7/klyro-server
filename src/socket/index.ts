import http from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./handlers.js";
import { setIO } from "./socket.js";

export function initializeSocket(server: http.Server){
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    registerSocketHandlers(io);
    setIO(io);

    return io;
}