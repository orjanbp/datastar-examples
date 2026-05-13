import { Router } from 'express';
import {
  createTodoFromFormAndRedirect,
  deleteTodoFromFormAndRedirect,
  renderTodoPage,
} from './todoFormPageController';

const router = Router();

router.get('/', renderTodoPage);
router.post('/create', createTodoFromFormAndRedirect);
router.post('/delete/:id', deleteTodoFromFormAndRedirect);

export default router;