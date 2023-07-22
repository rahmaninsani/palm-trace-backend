import express from 'express';

import rantaiPasokController from '../controllers/rantai-pasok-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/api/rantai-pasok/kontrak', rantaiPasokController.createKontrak);
router.put('/api/rantai-pasok/kontrak/:idKontrak', rantaiPasokController.confirmContract);
router.get('/api/rantai-pasok/kontrak/pks', rantaiPasokController.getAllByIdPks);
router.get('/api/rantai-pasok/kontrak/koperasi', rantaiPasokController.getAllByIdKoperasi);

export default router;
