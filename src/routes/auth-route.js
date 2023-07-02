import express from 'express';

import authController from '../controllers/auth-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/api/users', authController.register);
router.post('/api/users/login', authController.login);

router.get('/api/users/me', authMiddleware, authController.me);

export default router;
