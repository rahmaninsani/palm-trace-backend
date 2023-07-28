import express from 'express';

import util from '../utils/util.js';
import pengirimanController from '../controllers/pengiriman-controller.js';
import { authMiddleware, authMiddlewareRole } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi/pengiriman',
  authMiddlewareRole([petaniRole, koperasiRole]),
  pengirimanController.create
);

router.get(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi/pengiriman',
  authMiddlewareRole([petaniRole, koperasiRole, pksRole]),
  pengirimanController.findAll
);

export default router;
