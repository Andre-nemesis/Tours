import express from 'express';
import FavoriteController from '../controller/favoriteController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import Joi from 'joi';

const router = express.Router();

const {validate} = validateMiddleware;

const createLocationSchema = Joi.object({
  userId: Joi.string().required().uuid(),
  locationId: Joi.string().required().uuid()
});

router.post('/favorites', authMiddleware, validate(createLocationSchema), FavoriteController.addFavorite);
router.delete('/favorites', authMiddleware, FavoriteController.removeFavorite);
router.get('/favorites/:userId', authMiddleware, FavoriteController.getFavoritesByUser);

export default router;