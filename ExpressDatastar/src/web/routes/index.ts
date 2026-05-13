import { Router } from 'express';
import { items, type Item } from '../../api/models/item';

const router = Router();

router.get('/', (_req, res) => {
	res.render('pages/home', {
		title: 'Express Datastar',
		apiBasePath: '/api/items',
	});
});

router.get('/todo', (_req, res) => {
	res.render('pages/todo', {
		title: 'Todo',
	});
});

router.post('/todo', (req, res) => {
	const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';

	if (!name) {
		res.status(400).send('Item name is required');
		return;
	}

	const newItem: Item = { id: Date.now(), name };

	items.push(newItem);
	res.redirect(303, '/todo');
});

export default router;
