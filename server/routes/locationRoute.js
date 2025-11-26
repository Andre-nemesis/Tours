import express from 'express';
import locationsController from '../controller/locationsController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';

const router = express.Router();

router.post('/locations', authMiddleware, validateMiddleware.validate, locationsController.createLocation);
router.get('/locations',authMiddleware, validateMiddleware.validate, locationsController.getLocations);
router.get('/locations-with-details',authMiddleware, validateMiddleware.validate, locationsController.getLocationsWithComponents);
router.get('/locations-with-details/:id',authMiddleware, validateMiddleware.validate, locationsController.getLocationsWithComponentsById);

export default router;