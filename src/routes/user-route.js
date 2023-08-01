import express from 'express';

import util from '../utils/util.js';
import userController from '../controllers/user-controller.js';
import { authMiddleware, authMiddlewareRole } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.get('/api/users', authMiddlewareRole([pksRole, koperasiRole, petaniRole]), userController.findAll);

export default router;
