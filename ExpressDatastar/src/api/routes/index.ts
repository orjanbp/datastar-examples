import { Router } from 'express';
import itemRoutes from './items';

const router = Router();

router.use('/items', itemRoutes);

export default router;
