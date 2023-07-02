import express from 'express';

import authController from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/api/users', authController.register);
router.post('/api/users/login', authController.login);

export default router;
