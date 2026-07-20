import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createChannelController } from './channel.controller.js';

const router = Router();

router.post("/server/:serverId/channel", authenticate, createChannelController);




export default router;