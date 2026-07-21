import { z } from 'zod';


export const sendMessageSchema = z.object({
    content: z.string().trim().min(1).max(2000),
});

export const channelIdParamSchema = z.object({
    channelId: z.string(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;