import { Router } from 'express';
import todoRoutes from './todoRoutes';

const router = Router();

router.use('/todo', todoRoutes);

export default router;
