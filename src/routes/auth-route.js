import express from 'express';

import authController from '../controllers/auth-controller.js';
import { authMiddleware, isLoggedInMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/api/users', isLoggedInMiddleware, authController.register);
router.post('/api/users/login', isLoggedInMiddleware, authController.login);

router.get('/api/users/me', authMiddleware, authController.me);
router.delete('/api/users/logout', authMiddleware, authController.logout);

export default router;
