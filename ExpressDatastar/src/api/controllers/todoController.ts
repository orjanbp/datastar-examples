import { Request, Response, NextFunction } from 'express';
import { items, TodoItem } from '../models/todoItem';

// TODO: Clean up the use of these things

type TodoItemParams = {
  id?: string;
};

type TodoItemBody = {
  name?: string;
};

export const createTodoItemAsync = (
  req: Request<{}, {}, TodoItemBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      res.status(400).json({ message: 'TodoItem name is required' });
      return;
    }

    const newTodoItem: TodoItem = { id: Date.now().toString(), name: name.trim() };

    items.push(newTodoItem);
    res.status(201).json(newTodoItem);
  } catch (error) {
    next(error);
  }
};

export const getAllTodoItemsAsync = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getTodoItemAsync = (
  req: Request<TodoItemParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = req.params.id;

    if (itemId === null) {
      res.status(400).json({ message: 'Invalid TodoItem id' });
      return;
    }

    const todoItem = items.find((entry: TodoItem) => entry.id === itemId);

    if (!todoItem) {
      res.status(404).json({ message: 'TodoItem not found' });
      return;
    }

    res.json(todoItem);
  } catch (error) {
    next(error);
  }
};

export const updateTodoItemAsync = (
  req: Request<TodoItemParams, {}, TodoItemBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = req.params.id;
    const { name } = req.body;

    if (itemId === null) {
      res.status(400).json({ message: 'Invalid todoItem id' });
      return;
    }

    if (!name?.trim()) {
      res.status(400).json({ message: 'TodoItem name is required' });
      return;
    }

    const itemIndex = items.findIndex((entry: TodoItem) => entry.id === itemId);

    if (itemIndex === -1) {
      res.status(404).json({ message: 'TodoItem not found' });
      return;
    }

    items[itemIndex]!.name = name.trim();
    res.json(items[itemIndex]);
  } catch (error) {
    next(error);
  }
};

export const deleteTodoItemAsync = (
  req: Request<TodoItemParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = req.params.id;

    if (itemId === null) {
      res.status(400).json({ message: 'Invalid todoItem id' });
      return;
    }

    const itemIndex = items.findIndex((entry: TodoItem) => entry.id === itemId);

    if (itemIndex === -1) {
      res.status(404).json({ message: 'TodoItem not found' });
      return;
    }

    const deletedTodoItem = items.splice(itemIndex, 1)[0];
    res.json(deletedTodoItem);
  } catch (error) {
    next(error);
  }
};
