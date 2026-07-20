import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createChannelController, getChannelController } from './channel.controller.js';

const router = Router();

router.post("/server/:serverId/channel", authenticate, createChannelController);
router.get("/server/:serverId/channel", authenticate, getChannelController);




export default router;