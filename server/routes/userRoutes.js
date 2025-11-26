import express from 'express';
import UserController from '../controller/userController.js';
import {authMiddleware,optionalAuth} from '../middlewares/authMiddleware.js';
import validateMiddleware from '../middlewares/validateMiddleware.js';
import Joi from 'joi';

const router = express.Router();

const {validate, validateParams} = validateMiddleware;

const createLocationSchema = Joi.object({
  name: Joi.string().required().min(5),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8)
});

const idSchema = Joi.object({
  id: Joi.string().uuid().required()
});

router.get('/users',authMiddleware, UserController.getUsers);
router.get('/users/:id',authMiddleware,validateParams(idSchema), UserController.getUserById);
router.post('/users',optionalAuth,validate(createLocationSchema), UserController.createUser);
router.put('/users/:id',authMiddleware,validate(createLocationSchema),validateParams(idSchema), UserController.updateUser);
router.delete('/users/:id',authMiddleware,validateParams(idSchema), UserController.removeUser);

export default router;