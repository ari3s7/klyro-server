import { z } from 'zod';

export const createChannelSchema = z.object({
    name: z.string(),
    description: z.string(),
})

export const serverIdParamSchema = z.object({
    serverId: z.string(),
})

export type CreateChannelInput = z.infer<typeof createChannelSchema>