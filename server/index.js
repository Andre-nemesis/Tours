import express from 'express';
import cors from 'cors';
import locationRoute from './routes/locationRoute.js';
import favoriteRoute from './routes/favoriteRoute.js';
import syncRoute from './routes/syncRoute.js';

const app = express();

// Middlewares
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api',locationRoute);
app.use('/api', favoriteRoute);
app.use('/api', syncRoute);

export default app;