import express from 'express';

import authController from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/api/users', authController.register);

export default router;
