import express from 'express';
import locationsController from '../controller/locationsController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import Joi from 'joi';

const router = express.Router();

const {validateParams} = validateMiddleware;

const idSchema = Joi.object({
  id: Joi.string().uuid().required()
});

router.post('/locations', authMiddleware, locationsController.createLocation);
router.get('/locations',authMiddleware, locationsController.getLocations);
router.get('/locations-with-details',authMiddleware, locationsController.getLocationsWithComponents);
router.get('/locations-with-details/:id',authMiddleware, validateParams(idSchema), locationsController.getLocationsWithComponentsById);

export default router;