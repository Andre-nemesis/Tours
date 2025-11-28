import express from 'express';
import locationRoute from './routes/locationRoute.js';
import favoriteRoute from './routes/favoriteRoute.js';
import syncRoute from './routes/syncRoute.js';
import userRoutes from './routes/userRoutes.js';
import authRoute from './routes/authRoute.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/archives', express.static(path.join(__dirname, 'archives')));

// Rotas
app.use('/api', locationRoute);
app.use('/api', favoriteRoute);
app.use('/api', syncRoute);
app.use('/api', userRoutes);
app.use('/api', authRoute);

// Erros
app.use(notFound);
app.use(errorHandler);

export default app;