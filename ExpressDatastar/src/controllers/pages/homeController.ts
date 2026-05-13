import { Request, Response } from 'express';

export const renderHomePage = (_req: Request, res: Response) => {
  res.render('pages/home', {
    title: 'Express Datastar',
    apiBasePath: '/api/items',
  });
};