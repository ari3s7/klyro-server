import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

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