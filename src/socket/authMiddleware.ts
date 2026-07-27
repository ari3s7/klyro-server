// server/socket/authMiddleware.ts
import type { Socket } from "socket.io";

import { verifyAccessToken } from "../utils/jwt.js";

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
) {
  try {
    const rawCookie = socket.handshake.headers.cookie;

    if (!rawCookie) {
      return next(new Error("Unauthorized: no cookie"));
    }
    
    const token = rawCookie
       .split("; ")
       .find((c) => c.startsWith("accessToken="))
       ?.split("=")[1];

    if (!token) {
      return next(new Error("Unauthorized: no access token"));
    }

    const payload = verifyAccessToken(token);

    socket.data.userId = payload.userId;

    next();
  } catch (err) {
    next(new Error("Unauthorized: invalid token"));
  }
}