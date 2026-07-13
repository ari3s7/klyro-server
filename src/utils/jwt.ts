import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { JwtPayload } from "../types/jwt.types.js";

export function generateAccessToken(payload: object) {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRES_IN
    });
}

export function generateRefreshToken(payload: object) {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_IN
    })
}

export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(
        token,
        env.REFRESH_TOKEN_SECRET
    ) as JwtPayload
}