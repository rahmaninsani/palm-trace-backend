import express from 'express';

import util from '../utils/util.js';
import kebunController from '../controllers/kebun-controller.js';
import { authMiddleware, authMiddlewareRole } from '../middlewares/auth-middleware.js';

const petaniRole = util.getAttributeName('petani').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const pksRole = util.getAttributeName('pks').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.post('/api/users/kebun', authMiddlewareRole([petaniRole]), kebunController.create);
router.put('/api/users/kebun/:idKebun', authMiddlewareRole([petaniRole]), kebunController.update);
router.get('/api/users/kebun/:idKebun', authMiddlewareRole([petaniRole, koperasiRole, pksRole]), kebunController.findOne);
router.get(
  '/api/users/kebun/:idKebun/history',
  authMiddlewareRole([petaniRole, koperasiRole, pksRole]),
  kebunController.findOneHistory
);
router.get('/api/users/kebun', authMiddlewareRole([petaniRole]), kebunController.findAll);

export default router;
