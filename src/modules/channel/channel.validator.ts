import { z } from 'zod';

export const createChannelSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().min(5).max(200),
})

export const serverIdParamSchema = z.object({
    serverId: z.string(),
})

export const channelIdSchema = z.object({
    channelId: z.string(),
})

export const updateChannelSchema = z.object({
    name: z.string().min(3).max(50),
    description: z.string().min(5).max(200),
})

export type CreateChannelInput = z.infer<typeof createChannelSchema>;
export type UpdateChannelInput = z.infer<typeof updateChannelSchema>;