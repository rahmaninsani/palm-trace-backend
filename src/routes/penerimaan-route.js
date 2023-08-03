import express from 'express';

import util from '../utils/util.js';
import penerimaanController from '../controllers/penerimaan-controller.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi/penerimaan',
  authRoleMiddleware([koperasiRole, pksRole]),
  penerimaanController.create
);

router.get(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi/penerimaan',
  authRoleMiddleware([koperasiRole, pksRole, petaniRole]),
  penerimaanController.findAll
);

export default router;
