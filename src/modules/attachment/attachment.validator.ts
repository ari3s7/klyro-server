import { z } from 'zod';


export const attachmentSchema = z.object({
    url: z.url(),
    fileName: z.string().min(1),
    mimeType: z.string().min(1),
    size: z.number().positive(),
})


export type AttachmentSchemaInput = z.infer<typeof attachmentSchema>;