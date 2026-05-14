import { Router } from 'express';
import todoFormRoutes from '../features/todoFormSubmit/todoFormRoutes';

const router = Router();

router.get('/', (_req, res) => {
	res.render('pages/home', {
	});
});

router.use('/todo-form', todoFormRoutes);

export default router;
