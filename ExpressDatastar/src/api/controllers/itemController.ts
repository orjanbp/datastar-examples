import { Request, Response, NextFunction } from 'express';
import { items, Item } from '../models/item';

type ItemParams = {
  id?: string;
};

type ItemBody = {
  name?: string;
};

const parseItemId = (id?: string) => {
  const parsedId = Number(id);

  const result = Number.isFinite(parsedId) ? parsedId : null;

  console.log(parsedId, result);
  return result;
};

export const createItem = (
  req: Request<{}, {}, ItemBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      res.status(400).json({ message: 'Item name is required' });
      return;
    }

    const newItem: Item = { id: Date.now(), name: name.trim() };

    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

export const getItems = (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const getItemById = (
  req: Request<ItemParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const itemId = parseItemId(id);

    if (itemId === null) {
      res.status(400).json({ message: 'Invalid item id' });
      return;
    }

    const item = items.find((entry: Item) => entry.id === itemId);

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateItem = (
  req: Request<ItemParams, {}, ItemBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const itemId = parseItemId(id);

    if (itemId === null) {
      res.status(400).json({ message: 'Invalid item id' });
      return;
    }

    if (!name?.trim()) {
      res.status(400).json({ message: 'Item name is required' });
      return;
    }

    const itemIndex = items.findIndex((entry: Item) => entry.id === itemId);

    if (itemIndex === -1) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    items[itemIndex]!.name = name.trim();
    res.json(items[itemIndex]);
  } catch (error) {
    next(error);
  }
};

export const deleteItem = (
  req: Request<ItemParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const itemId = parseItemId(id);

    if (itemId === null) {
      res.status(400).json({ message: 'Invalid item id' });
      return;
    }

    const itemIndex = items.findIndex((entry: Item) => entry.id === itemId);

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
