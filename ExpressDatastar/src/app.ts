import path from 'node:path';
import express from 'express';
import apiRoutes from './api/routes';
import pageRoutes from './web/routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.set('views', path.join(__dirname, '/web/views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/', pageRoutes);
app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;