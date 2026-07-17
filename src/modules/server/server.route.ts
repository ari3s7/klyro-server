import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createServerController, getServerController, getServerContr, joinServerController } from './server.controller.js';

const router =  Router();

router.post("/", authenticate, createServerController);
router.get("/", authenticate, getServerController);
router.get("/:serverId", authenticate, getServerContr);
router.post("/join", authenticate, joinServerController)

export default router;