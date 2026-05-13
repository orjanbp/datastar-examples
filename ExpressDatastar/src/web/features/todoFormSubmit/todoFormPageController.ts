import { NextFunction, Request, Response } from 'express';
import { TodoItem } from '../../../api/models/todoItem';
import { createTodoItem, deleteTodoItem, getTodoItems } from './todoFormClient';

const getBaseUrl = (req: Request): string => `${req.protocol}://${req.get('host')}`;

const refreshTodoPage = (res: Response) => {
  res.redirect('/todo-form');
};

type TodoPageViewModel = {
  todos: TodoItem[];
};
export const renderTodoPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await getTodoItems(getBaseUrl(req));
    const model: TodoPageViewModel = {
      todos: items.toReversed()
    };

    res.render('pages/todoForm', model);
  } catch (error) {
    next(error);
  }
};

type TodoPostBody = {
  name?: string;
};
export const createTodoFromFormAndRedirect = async (
  req: Request<{}, {}, TodoPostBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = req.body.name?.trim();

    if (name) {
      await createTodoItem(getBaseUrl(req), { name });
    }

    refreshTodoPage(res);
  } catch (error) {
    next(error);
  }
};

type TodoDeleteParams = {
  id: string;
};
export const deleteTodoFromFormAndRedirect = async (
  req: Request<TodoDeleteParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoId = req.params.id;

    if (!!todoId) {
      await deleteTodoItem(getBaseUrl(req), todoId);
    }

    refreshTodoPage(res);
  } catch (error) {
    next(error);
  }
};