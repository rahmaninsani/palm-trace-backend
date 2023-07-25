import express from 'express';

import util from '../utils/util.js';
import deliveryOrderController from '../controllers/delivery-order-controller.js';
import { authMiddleware, authMiddlewareRole } from '../middlewares/auth-middleware.js';

const pksRole = util.getAttributeName('pks').databaseRoleName;
const koperasiRole = util.getAttributeName('koperasi').databaseRoleName;
const petaniRole = util.getAttributeName('petani').databaseRoleName;

const router = express.Router();

router.use(authMiddleware);

router.post('/api/kontrak/:idKontrak/delivery-order', authMiddlewareRole([pksRole]), deliveryOrderController.create);
router.put(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder',
  authMiddlewareRole([koperasiRole]),
  deliveryOrderController.confirm
);
router.get(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder',
  authMiddlewareRole([pksRole, koperasiRole, petaniRole]),
  deliveryOrderController.findOne
);
router.get(
  '/api/kontrak/:idKontrak/delivery-order/:idDeliveryOrder/history',
  authMiddlewareRole([pksRole, koperasiRole, petaniRole]),
  deliveryOrderController.findOneHistory
);
router.get(
  '/api/kontrak/:idKontrak/delivery-order',
  authMiddlewareRole([pksRole, koperasiRole, petaniRole]),
  deliveryOrderController.findAll
);

export default router;
