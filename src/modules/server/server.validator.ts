import { z } from 'zod';


export const createServerSchema = z.object({
    name: z.string().trim().min(3).max(100),
    description: z.string().trim().max(500).optional(),
});



export const joinServerSchema = z.object({
    inviteCode: z.string(),
})

export const serverIdParamSchema= z.object({
    serverId: z.string(),
})

export const leaveServerSchema = z.object({
    serverId: z.string(),
})

export const updateServerSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    avatar: z.string().optional(),
});

export const updateServerParam = z.object({
    serverId: z.string(),
})

export type CreateServerInput = z.infer<typeof createServerSchema>;
export type JoinServerInput = z.infer<typeof joinServerSchema>;
export type ServerIdInput = z.infer<typeof serverIdParamSchema>;
export type LeaveServerInput = z.infer<typeof leaveServerSchema>;
export type UpdateServerInput = z.infer<typeof updateServerSchema>;