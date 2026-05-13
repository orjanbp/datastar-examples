import { Router } from 'express';
import { renderHomePage } from '../../controllers/pages/homeController';

const router = Router();

router.get('/', renderHomePage);

export default router;