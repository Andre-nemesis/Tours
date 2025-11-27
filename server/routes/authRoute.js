import express from 'express';
import {login} from '../controller/authController.js';
import {optionalAuth} from '../middlewares/authMiddleware.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import Joi from 'joi';

const router = express.Router();

const {validate} = validateMiddleware;

const createLocationSchema = Joi.object({
  email: Joi.string().required().min(12),
  password: Joi.string().required().min(6)
});

router.post('/login', optionalAuth, validate(createLocationSchema), login);

export default router;