import Router from 'express';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { createServerController } from './server.controller.js';

const router =  Router();

router.post("/", authenticate, createServerController);

export default router;