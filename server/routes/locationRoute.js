import express from 'express';
import LocationController from '../controller/locationsController.js'

const router = express.Router()

router.get('/all',LocationController.getLocations);
router.get('/location-components',LocationController.getLocationsWithComponents);
router.get('/location-components/:id',LocationController.getLocationsWithComponentsById);

export default router;