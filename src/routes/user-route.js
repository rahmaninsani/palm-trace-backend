import express from 'express';

import kebunController from '../controllers/kebun-controller.js';
import { authMiddleware } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/api/users/petani/kebun', kebunController.create);
router.put('/api/users/petani/kebun/:idKebun', kebunController.update);
router.get('/api/users/petani/kebun/:idKebun', kebunController.getHistoryById);
router.get('/api/users/petani/kebun', kebunController.getAllByIdPetani);

export default router;
