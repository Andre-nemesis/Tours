import express from 'express';
import FavoriteController from '../controller/favoriteController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/favorites', authMiddleware, FavoriteController.addFavorite);
router.post('/favorites', FavoriteController.addFavorite);
router.delete('/favorites', FavoriteController.removeFavorite);
router.get('/favorites/:userId', FavoriteController.getFavoritesByUser);

export default router;