import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
	res.render('pages/home', {
		title: 'Express Datastar',
		apiBasePath: '/api/items',
	});
});

export default router;
