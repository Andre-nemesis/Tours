import express from 'express';
import FavoriteController from '../controller/favoriteController.js';

const router = express.Router();

router.post('/favorites', FavoriteController.addFavorite);

export default router;
