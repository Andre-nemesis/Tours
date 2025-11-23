import express from 'express';
import cors from 'cors';
import locationRoute from './routes/locationRoute.js';
import favoriteRoute from './routes/favoriteRoute.js';

const app = express();

// Middlewares
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api',locationRoute);
app.use('/api', favoriteRoute);

export default app;