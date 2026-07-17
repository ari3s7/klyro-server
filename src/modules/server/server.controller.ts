import type{ Request, Response } from 'express';
import { createServer, getMyServers, getServer, joinServer } from "./server.service.js";
import { ApiResponse } from '../../utils/ApiResponse.js';
import { getServerSchema, joinServerSchema } from './server.validator.js';


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
    const { serverId } = getServerSchema.parse(req.params);

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