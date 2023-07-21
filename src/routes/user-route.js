import express from 'express';

import kebunController from '../controllers/kebun-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/api/users/petani/kebun', kebunController.create);

export default router;
