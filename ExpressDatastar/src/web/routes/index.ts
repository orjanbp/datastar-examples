import { Router } from 'express';
import {
	createTodoFromFormAndRedirect,
	deleteTodoFromFormAndRedirect,
	renderTodoPage,
} from '../controllers/todoPageController';

const router = Router();

router.get('/', (_req, res) => {
	res.render('pages/home', {
		title: 'Express Datastar',
		apiBasePath: '/api/todo',
	});
});

router.get('/todo', renderTodoPage);
router.post('/todo/create', createTodoFromFormAndRedirect);
router.post('/todo/delete/:id', deleteTodoFromFormAndRedirect);

export default router;
