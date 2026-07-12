import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().trim().min(3).max(20),
    email: z.email(),
    password: z.string().min(8).max(32),
})

export type RegisterInput = z.infer<typeof registerSchema>;