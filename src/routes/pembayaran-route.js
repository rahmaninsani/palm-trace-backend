import express from 'express';

import util from '../utils/util.js';
import pembayaranController from '../controllers/pembayaran-controller.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi/pembayaran',
  authRoleMiddleware([pksRole, koperasiRole]),
  pembayaranController.create
);

router.get(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi/pembayaran',
  authRoleMiddleware([pksRole, koperasiRole, petaniRole]),
  pembayaranController.findAll
);

export default router;
