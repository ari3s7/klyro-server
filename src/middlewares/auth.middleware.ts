import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../lib/prisma.js";
import { verifyAccessToken } from "../utils/jwt.js";


export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  const token =
    req.cookies.accessToken ??
    (authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined);

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
    where: {
        id: payload.userId,
    }, select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
    },
    });

    if(!user) {
        throw new ApiError(401, "Unauthorized");
    }

    req.user = user;

    next();
}