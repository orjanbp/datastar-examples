import { Request, Response, NextFunction } from 'express';
import { items, Item } from '../models/item';

export const createItem = (req: Request<Item>, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    const newItem: Item = { id: Date.now(), name };

    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

export const getItems = (req: Request<Item>, res: Response, next: NextFunction) => {
  try {
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getItemById = (req: Request<Item>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = items.find((entry: Item) => entry.id === id);

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateItem = (req: Request<Item>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const itemIndex = items.findIndex((entry: Item) => entry.id === id);

    if (itemIndex === -1) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    items[itemIndex]!.name = name;
    res.json(items[itemIndex]);
  } catch (error) {
    next(error);
  }
};

export const deleteItem = (req: Request<Item>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const itemIndex = items.findIndex((entry: Item) => entry.id === id);

    if (itemIndex === -1) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    const deletedItem = items.splice(itemIndex, 1)[0];
    res.json(deletedItem);
  } catch (error) {
    next(error);
  }
};
