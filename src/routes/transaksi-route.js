import express from 'express';

import transaksiController from '../controllers/transaksi-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/api/transaksi', transaksiController.create);

export default router;
