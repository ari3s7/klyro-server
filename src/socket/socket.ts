import { Server } from "socket.io";

let io: Server;

export function setIO(socketIO: Server) {
  io = socketIO;
}

export function getIO() {
  return io;
}