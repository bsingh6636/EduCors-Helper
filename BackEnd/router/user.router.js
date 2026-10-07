import express from 'express';
import {
  regenerateApiKey,
  validateApiKey,
  userLogOut,
  userSign,
  userSignUp,
} from '../controller/user.controller.js';
import { Auth } from '../middleware/auth.js';
import { getApiUsage } from '../controller/forward.controller.js';
import { requireDatabase } from '../database.js';
import { authRateLimit, clientRateLimit } from '../middleware/rateLimit.js';

const router = express.Router();
router.post(
  '/signIn',
  authRateLimit,
  (req, res, next) => {
    if (!req.body?.UserNameorEmail || !req.body?.Password)
      return res.status(400).json({
        success: false,
        message: 'Username or email and password are required.',
      });
    next();
  },
  requireDatabase,
  userSign,
);
router.post('/signUp', authRateLimit, requireDatabase, userSignUp);
router.get('/auth', Auth, (req, res) =>
  res.json({ success: true, data: req.user }),
);
router.post('/signOut', userLogOut);
router.post('/regenerateApiKey', Auth, regenerateApiKey);
router.get('/validateKey', clientRateLimit, requireDatabase, validateApiKey);
router.get('/apiUsage', Auth, getApiUsage);
router.post('/apiUsage', Auth, getApiUsage);
export default router;
