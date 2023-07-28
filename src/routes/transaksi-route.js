import express from 'express';

import util from '../utils/util.js';
import transaksiController from '../controllers/transaksi-controller.js';
import { authMiddleware, authMiddlewareRole } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi',
  authMiddlewareRole([petaniRole]),
  transaksiController.create
);

router.put(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi',
  authMiddlewareRole([koperasiRole, pksRole]),
  transaksiController.confirm
);

router.get(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi',
  authMiddlewareRole([pksRole, koperasiRole, petaniRole]),
  transaksiController.findOne
);

router.get(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi',
  authMiddlewareRole([pksRole, koperasiRole, petaniRole]),
  transaksiController.findAll
);

export default router;
