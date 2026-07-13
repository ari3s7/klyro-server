import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validators.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import type { JwtPayload } from "../types/jwt.types.js";
import crypto from "crypto";


export async function register(data: RegisterInput) {
    const {username, email, password} = data;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username},
            ],
        },
    });

    if(existingUser){
        if(existingUser.email == email){
            throw new ApiError(400, "Email already exists")
        }

        throw new ApiError(400, "Username already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        },
        select : {
            id: true,
            username: true,
            email: true,
            avatar: true,
            bio: true,
            createdAt: true
        }
    });
    return user;

}

export async function login(data: LoginInput) {
    const { email, password } = data;
    
    const user = await prisma.user.findUnique({
        where: {
            email
        },
    })
    if(!user){
        throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password")
    };

    const payload: JwtPayload = {
        userId: user.id,
        email: user.email,
    }

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await prisma.refreshToken.create({
        data: {
            token: hashedRefreshToken,
            userId: user.id,
            expireAt: refreshTokenExpiresAt
        }
    });

    return { accessToken, refreshToken };
} 

export async function refresh(refreshToken: string) {

    const payload = verifyRefreshToken(refreshToken);
   
    const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const storedToken = await prisma.refreshToken.findFirst({
        where: {
            token: hashedRefreshToken,
            userId: payload.userId,
        },
    });
    if(!storedToken) {
        throw new ApiError(401, "Unauthorized");
    }

    if(storedToken.expireAt < new Date()) {
        throw new ApiError(401, "Refresh token expired");
    }

    const accessToken = generateAccessToken({
        userId: payload.userId,
        email: payload.email,
    });

    return accessToken;
}

export async function logout(refreshToken: string) {
    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    await prisma.refreshToken.deleteMany({
        where: {
            token: hashedToken,
        }
    })
}