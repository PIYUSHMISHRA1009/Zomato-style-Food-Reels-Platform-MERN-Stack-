import express from 'express';
import { authUserMiddleware } from '../middlewares/auth.middleware.js';
import { getUserFeed } from '../controllers/feed.controller.js';

const router = express.Router();

router.get('/', authUserMiddleware, getUserFeed);

export default router;
