import { z } from 'zod';


export const messageSchema = z.object({
    content: z.string().trim().min(1).max(2000),
});

export const channelIdParamSchema = z.object({
    channelId: z.string(),
});

export const messageIdSchema = z.object({
    messageId: z.string(),
})

export type MessageInput = z.infer<typeof messageSchema>;