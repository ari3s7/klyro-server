import { z } from 'zod';


export const createServerSchema = z.object({
    name: z.string().trim().min(3).max(100),
    description: z.string().trim().max(500).optional(),
})

export type CreateServerInput = z.infer<typeof createServerSchema>