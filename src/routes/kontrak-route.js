import express from 'express';

import util from '../utils/util.js';
import kontrakController from '../controllers/kontrak-controller.js';
import { authMiddleware, authMiddlewareRole } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.post('/api/kontrak', authMiddlewareRole([pksRole]), kontrakController.create);
router.put('/api/kontrak/:idKontrak', authMiddlewareRole([koperasiRole]), kontrakController.confirm);
router.get('/api/kontrak/:idKontrak', authMiddlewareRole([pksRole, koperasiRole, petaniRole]), kontrakController.findOne);
router.get(
  '/api/kontrak/:idKontrak/history',
  authMiddlewareRole([pksRole, koperasiRole, petaniRole]),
  kontrakController.findOneHistory
);
router.get('/api/kontrak', authMiddlewareRole([pksRole, koperasiRole, petaniRole]), kontrakController.findAll);

export default router;
