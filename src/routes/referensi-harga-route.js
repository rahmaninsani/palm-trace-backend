import express from 'express';

import referensiHargaController from '../controllers/referensi-harga-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/api/referensi-harga', referensiHargaController.create);
router.get('/api/referensi-harga/:id', referensiHargaController.get);
router.get('/api/referensi-harga', referensiHargaController.getAll);

export default router;
