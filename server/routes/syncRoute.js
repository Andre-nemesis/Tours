import express from 'express';
import SyncController from '../controller/syncController.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/sync-offline', authMiddleware, SyncController.SyncOfflineConnection);

export default router;
