import type {Request, Response} from 'express';
import { channelIdParamSchema, messageIdSchema, messageSchema } from './message.validator.js';
import { getMessages, sendMessage, updateMessage } from './message.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export async function sendMessageController(req: Request, res: Response){
     const { channelId } = channelIdParamSchema.parse(req.params);
     const userId = req.user!.id;
     const data = messageSchema.parse(req.body);

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

export async function updateMessageController(req: Request, res: Response){
    const { messageId } = messageIdSchema.parse(req.params);
    const userId = req.user!.id;

    const data = messageSchema.parse(req.body);

    const messages = await updateMessage(messageId, userId, data);

    return res.status(200).json(
        new ApiResponse(true, "Message updated", messages)
    );
}