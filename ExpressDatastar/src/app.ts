import path from 'node:path';
import express from 'express';
import apiRoutes from './routes/api';
import pageRoutes from './routes/pages';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', pageRoutes);
app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;