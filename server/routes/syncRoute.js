import express from 'express';
import SyncController from '../controller/syncController.js';

const router = express.Router();

router.post('/sync-offline', SyncController.SyncOfflineConnection);

export default router;
