import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createChannelController, deleteChannelController, getChannelController, updateChannelController } from './channel.controller.js';

const router = Router();

router.post("/server/:serverId/channel", authenticate, createChannelController);
router.get("/server/:serverId/channel", authenticate, getChannelController);
router.put("/channel/:channelId", authenticate, updateChannelController);
router.delete("/channel/:channelId", authenticate, deleteChannelController);




export default router;