import type{ Request, Response } from 'express';
import { createServer, deleteServer, getMyServers, getServer, joinServer, leaveServer, updateServer } from "./server.service.js";
import { ApiResponse } from '../../utils/ApiResponse.js';
import { joinServerSchema, leaveServerSchema, serverIdParamSchema, updateServerParam, updateServerSchema } from './server.validator.js';


export async function createServerController(req: Request, res: Response) {
    const server = await createServer(req.user!.id, req.body);

    res.status(201).json( new ApiResponse(true, "Server created Successfully", server));
};

export async function getServerController(req: Request, res: Response) {
    const servers = await getMyServers(req.user!.id);

    res.status(200).json(
        new ApiResponse(true, "Server fetched successfully", servers)
    );
}

export async function getServerContr(req: Request, res: Response) {
    const { serverId } = serverIdParamSchema.parse(req.params);

    const userId = req.user!.id;

    const server = await getServer(serverId, userId);

    return res.status(200).json( new ApiResponse(true, "Server fetched successfully", server));
};

export async function joinServerController(req: Request, res: Response) {
    const { inviteCode } = joinServerSchema.parse(req.body);

    const userId = req.user!.id;
    const server = await joinServer(inviteCode, userId);

    return res.status(200).json( new ApiResponse(true, "Server joined", server));
};

export async function leaveServerController(req: Request, res: Response) {
    const { serverId } = leaveServerSchema.parse(req.body);

    const userId = req.user!.id;

    await leaveServer(serverId, userId);

    return res.status(200).json(
        new ApiResponse(true, "Left Server successfully", null)
    );
}

export async function updateServerController (req: Request, res: Response) {
    const { serverId } = updateServerParam.parse(req.params);
    const data = updateServerSchema.parse(req.body);

    const updatedServer = await updateServer(serverId, req.user!.id, data);

    return res.status(200).json(
        new ApiResponse( true, "Server updated successfully", updatedServer)
    );
}

export async function deleteServerController(req: Request, res: Response){
    const { serverId } = serverIdParamSchema.parse(req.params);

    const userId = req.user!.id;

    await deleteServer(serverId, userId);

    return res.status(200).json(
        new ApiResponse(true, "Server deleted successfully", null)
    );
}