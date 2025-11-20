import express from 'express';
import cors from 'cors';
import locationRoute from './routes/locationRoute.js';

const app = express();

// Middlewares
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api',locationRoute);

export default app;