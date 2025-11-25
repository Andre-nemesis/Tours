import express from 'express';
import FavoriteController from '../controller/favoriteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/favorites', authMiddleware, FavoriteController.addFavorite);

export default router;