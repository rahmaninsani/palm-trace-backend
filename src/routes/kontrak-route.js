import express from 'express';

import util from '../utils/util.js';
import kontrakController from '../controllers/kontrak-controller.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.post('/api/kontrak', authRoleMiddleware([pksRole]), kontrakController.create);
router.put('/api/kontrak/:idKontrak', authRoleMiddleware([koperasiRole]), kontrakController.confirm);
router.get('/api/kontrak/:idKontrak', authRoleMiddleware([pksRole, koperasiRole, petaniRole]), kontrakController.findOne);
router.get(
  '/api/kontrak/:idKontrak/history',
  authRoleMiddleware([pksRole, koperasiRole, petaniRole]),
  kontrakController.findOneHistory
);
router.get('/api/kontrak', authRoleMiddleware([pksRole, koperasiRole, petaniRole]), kontrakController.findAll);

export default router;
