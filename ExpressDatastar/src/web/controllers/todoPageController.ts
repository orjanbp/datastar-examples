import { NextFunction, Request, Response } from 'express';
import { TodoItem } from '../../api/models/todoItem';
import { createTodoItem, deleteTodoItem, getTodoItems } from '../client/todoClient';

type TodoPageViewModel = {
  title: string;
  todos: TodoItem[];
};

type TodoPostBody = {
  name?: string;
};

type TodoDeleteParams = {
  id?: string;
};

const getBaseUrl = (req: Request): string => `${req.protocol}://${req.get('host')}`;

const redirectToTodoPage = (res: Response) => {
  res.redirect('/todo');
};

const parseId = (rawId?: string): number | null => {
  if (!rawId) {
    return null;
  }

  const id = Number(rawId);
  return Number.isFinite(id) ? id : null;
};

const sortByNewestFirst = (items: TodoItem[]): TodoItem[] =>
  [...items].sort((left, right) => right.id - left.id);

export const renderTodoPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await getTodoItems(getBaseUrl(req));
    const model: TodoPageViewModel = {
      title: 'Todo',
      todos: sortByNewestFirst(items),
    };

    res.render('pages/todo', model);
  } catch (error) {
    next(error);
  }
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

    redirectToTodoPage(res);
  } catch (error) {
    next(error);
  }
};

export const deleteTodoFromFormAndRedirect = async (
  req: Request<TodoDeleteParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const todoId = parseId(req.params.id);

    if (todoId !== null) {
      await deleteTodoItem(getBaseUrl(req), todoId);
    }

    redirectToTodoPage(res);
  } catch (error) {
    next(error);
  }
};
