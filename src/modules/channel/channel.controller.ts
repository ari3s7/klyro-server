import type{ Request, Response } from "express";
import { createChannelSchema, serverIdParamSchema } from "./channel.validator.js";
import { createChannel } from "./channel.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export async function createChannelController(req: Request, res: Response){
    const { serverId } = serverIdParamSchema.parse(req.params);
    const userId = req.user!.id;
    const data = createChannelSchema.parse(req.body);

    const channel = createChannel(serverId, userId, data);

    return res.status(201).json(
        new ApiResponse(true, "Channel created", channel)
    );
};