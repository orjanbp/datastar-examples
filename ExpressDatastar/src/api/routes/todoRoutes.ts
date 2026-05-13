import { Router } from 'express';
import {
  createTodoItemAsync,
  getAllTodoItemsAsync,
  getTodoItemAsync,
  updateTodoItemAsync,
  deleteTodoItemAsync,
} from '../controllers/todoController';

const router = Router();

router.get('/', getAllTodoItemsAsync);
router.get('/:id', getTodoItemAsync);
router.post('/', createTodoItemAsync);
router.put('/:id', updateTodoItemAsync);
router.delete('/:id', deleteTodoItemAsync);

export default router;
