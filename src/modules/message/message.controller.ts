import type {Request, Response} from 'express';
import { channelIdParamSchema, sendMessageSchema } from './message.validator.js';
import { getMessages, sendMessage } from './message.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export async function sendMessageController(req: Request, res: Response){
     const { channelId } = channelIdParamSchema.parse(req.params);
     const userId = req.user!.id;
     const data = sendMessageSchema.parse(req.body);

     const message = await sendMessage(channelId, userId, data);

     return res.status(201).json(
        new ApiResponse(true, "Message sent", message)
     );
};

export async function getMessageController(req: Request, res: Response){
    const { channelId } = channelIdParamSchema.parse(req.params);
    const userId = req.user!.id;

    const messages = await getMessages(channelId, userId);

    return res.status(200).json(
        new ApiResponse(true, "All messages", messages)
    );
};