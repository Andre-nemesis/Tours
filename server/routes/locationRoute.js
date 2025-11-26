import express from 'express';
import locationsController from '../controller/locationsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';

const router = express.Router();

router.post('/locations', authMiddleware, validateMiddleware, locationsController.createLocation);

export default router;