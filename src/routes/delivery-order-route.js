import express from 'express';

import kontrakController from '../controllers/kontrak-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/api/kontrak', kontrakController.create);
router.put('/api/kontrak/:idKontrak', kontrakController.confirm);
router.get('/api/kontrak/pks', kontrakController.getAllByIdPks);
router.get('/api/kontrak/koperasi', kontrakController.getAllByIdKoperasi);
router.get('/api/kontrak/petani', kontrakController.getAllForPetani);
router.get('/api/kontrak/:idKontrak', kontrakController.getOneById);

export default router;
