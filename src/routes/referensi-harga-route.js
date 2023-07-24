import express from 'express';

import referensiHargaController from '../controllers/referensi-harga-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/api/referensi-harga-init', referensiHargaController.createInit);
router.post('/api/referensi-harga', referensiHargaController.create);
router.put('/api/referensi-harga/:idRefererensiHarga', referensiHargaController.update);
router.get('/api/referensi-harga/:idRefererensiHarga', referensiHargaController.getHistoryById);
router.get('/api/referensi-harga', referensiHargaController.getAll);

export default router;
