import express from 'express';
import corsMiddleware from './middlewares/corsMiddleware.js';
import { logger } from './middlewares/loggerMiddleware.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import locationRoute from './routes/locationRoute.js';
import favoriteRoute from './routes/favoriteRoute.js';
import syncRoute from './routes/syncRoute.js';

const app = express();

app.use(corsMiddleware);
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', locationRoute);
app.use('/api', favoriteRoute);
app.use('/api', syncRoute);

app.use(notFound);

app.use(errorHandler);

export default app;