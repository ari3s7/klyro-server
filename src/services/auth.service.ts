import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.js";
import type { RegisterInput } from "../validators/auth.validators.js";


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