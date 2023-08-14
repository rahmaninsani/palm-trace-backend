import express from 'express';

import util from '../utils/util.js';
import transaksiController from '../controllers/transaksi-controller.js';
import { authMiddleware, authRoleMiddleware } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi',
  authRoleMiddleware([petaniRole]),
  transaksiController.create
);

router.put(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi',
  authRoleMiddleware([koperasiRole, pksRole]),
  transaksiController.confirm
);

router.get(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi/:idTransaksi',
  authRoleMiddleware([pksRole, koperasiRole, petaniRole]),
  transaksiController.findOne
);

router.get(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/transaksi',
  authRoleMiddleware([pksRole, koperasiRole, petaniRole]),
  transaksiController.findAll
);

router.get(
  '/api/transaksi/this-week',
  authRoleMiddleware([pksRole, koperasiRole, petaniRole]),
  transaksiController.findAllByUserThisWeek
);

router.get(
  '/api/transaksi/laporan',
  authRoleMiddleware([pksRole, koperasiRole, petaniRole]),
  transaksiController.findAllByUserLaporan
);

router.get('/api/transaksi', authRoleMiddleware([pksRole, koperasiRole, petaniRole]), transaksiController.findAllByUser);

export default router;
