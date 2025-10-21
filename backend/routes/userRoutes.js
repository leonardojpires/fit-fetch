import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

router.post('/sync', UserController.syncUser);

export default router;
