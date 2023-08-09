import express from 'express';

import util from '../utils/util.js';
import kebunController from '../controllers/kebun-controller.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';
import fileMiddleware from '../middlewares/file-middleware.js';

const petaniRole = util.getAttributeName('petani').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const pksRole = util.getAttributeName('pks').databaseRoleName;

const filesUpload = fileMiddleware.upload().fields([
  { name: 'suratKeteranganLurah', maxCount: 1 },
  { name: 'suratKeteranganGantiRugi', maxCount: 1 },
  { name: 'sertifikatHakMilik', maxCount: 1 },
  { name: 'suratTandaBudidaya', maxCount: 1 },
  { name: 'sertifikatRspo', maxCount: 1 },
  { name: 'sertifikatIspo', maxCount: 1 },
  { name: 'sertifikatIscc', maxCount: 1 },
]);

const router = express.Router();

router.use(authMiddleware);

router.post('/api/users/kebun', authRoleMiddleware([petaniRole]), filesUpload, kebunController.create);
router.put('/api/users/kebun/:idKebun', authRoleMiddleware([petaniRole]), kebunController.update);
router.get('/api/users/kebun/:idKebun', authRoleMiddleware([petaniRole, koperasiRole, pksRole]), kebunController.findOne);
router.get(
  '/api/users/kebun/:idKebun/history',
  authRoleMiddleware([petaniRole, koperasiRole, pksRole]),
  kebunController.findOneHistory
);
router.get('/api/users/kebun', authRoleMiddleware([petaniRole]), kebunController.findAll);

export default router;
