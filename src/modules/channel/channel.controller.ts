import type{ Request, Response } from "express";
import { channelIdSchema, createChannelSchema, serverIdParamSchema, updateChannelSchema } from "./channel.validator.js";
import { createChannel, getChannel, updateChannel } from "./channel.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export async function createChannelController(req: Request, res: Response){
    const { serverId } = serverIdParamSchema.parse(req.params);
    const userId = req.user!.id;
    const data = createChannelSchema.parse(req.body);

    const channel = await createChannel(serverId, userId, data);

    return res.status(201).json(
        new ApiResponse(true, "Channel created", channel)
    );
};

export async function getChannelController(req: Request, res: Response) {
    const { serverId } = serverIdParamSchema.parse(req.params);
    const userId = req.user!.id;

    const channel = await getChannel(serverId, userId);

   return res.status(200).json(
        new ApiResponse(true, "Channel", channel)
    );
};

export async function updateChannelController(req: Request, res: Response){
    const { channelId } = channelIdSchema.parse(req.params);
    const userId = req.user!.id;
    const data = updateChannelSchema.parse(req.body);

    const channel = await updateChannel(channelId, userId, data);

    return res.status(200).json(
        new ApiResponse(true, "Channel Updated", channel)
    );
};