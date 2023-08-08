import express from 'express';

import util from '../utils/util.js';
import userController from '../controllers/user-controller.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;
const dinasRole = util.getAttributeName('dinas').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.put('/api/users/profil', authRoleMiddleware([pksRole, koperasiRole, petaniRole, dinasRole]), userController.update);
router.get('/api/users/profil', authRoleMiddleware([pksRole, koperasiRole, petaniRole, dinasRole]), userController.findOne);
router.get('/api/users', authRoleMiddleware([pksRole, koperasiRole, petaniRole]), userController.findAll);

export default router;
