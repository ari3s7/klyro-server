import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createServerController, getServerController } from './server.controller.js';

const router =  Router();

router.post("/", authenticate, createServerController);
router.get("/", authenticate, getServerController)

export default router;