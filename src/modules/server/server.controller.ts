import type{ Request, Response } from 'express';
import { createServer } from "./server.service.js";
import { ApiResponse } from '../../utils/ApiResponse.js';


export async function createServerController(req: Request, res: Response) {
    const server = await createServer(req.user!.id, req.body);

    res.status(201).json( new ApiResponse(true, "Server created Successfully", server));
};