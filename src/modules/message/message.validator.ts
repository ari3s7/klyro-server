import { z } from 'zod';


export const attachmentItemSchema = z.object({
  url: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number(),
});

export const messageSchema = z
  .object({
    content: z.string().trim().max(2000).optional().nullable(),
    type: z.enum(["TEXT", "IMAGE", "VIDEO", "FILE", "AUDIO"]).optional(),
    attachments: z.array(attachmentItemSchema).optional(),
    parentId: z.string().optional(),
  })
  .refine(
    (data) => (data.content && data.content.trim().length > 0) || (data.attachments && data.attachments.length > 0),
    {
      message: "Message must contain either content or an attachment",
    }
  );

export const channelIdParamSchema = z.object({
    channelId: z.string(),
});

export const messageIdSchema = z.object({
    messageId: z.string(),
});

export type MessageInput = z.infer<typeof messageSchema>;