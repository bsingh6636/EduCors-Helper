import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { FRONTENDURL, VERSION, isProxyOnly } from './envHelper.js';
import userRouter from './router/user.router.js';
import { clientRateLimit } from './middleware/rateLimit.js';
import {
  VerifyApiKey,
  forwardUrl,
  DEMO_TARGETS,
} from './controller/forward.controller.js';

export function createApp({
  forwarder = forwardUrl,
  proxyOnly = isProxyOnly,
} = {}) {
  const app = express();
  app.disable('x-powered-by');
  if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    next();
  });
  app.use(
    '/api/getData',
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      exposedHeaders: [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset',
        'Retry-After',
        'X-Proxy-Latency-Ms',
        'X-EduCors-Mode',
        'X-Served-By',
      ],
      maxAge: 600,
    }),
  );
  app.all(
    '/api/getData',
    clientRateLimit,
    express.raw({ type: () => true, limit: '1mb' }),
    VerifyApiKey,
    forwarder,
  );
  if (!proxyOnly) {
    app.use(
      cors({
        origin(origin, callback) {
          if (!origin || FRONTENDURL.includes(origin))
            return callback(null, true);
          callback(
            Object.assign(
              new Error('This origin is not allowed for account requests.'),
              { statusCode: 403 },
            ),
          );
        },
        credentials: true,
      }),
    );
    app.use(cookieParser());
    app.use(express.json({ limit: '32kb' }));
  }
  app.get(['/health', '/api/health'], (req, res) => {
    res.json({
      status: 'healthy',
      service: 'EduCors',
      role: proxyOnly ? 'proxy' : 'full',
      version: VERSION,
      accountsReady: mongoose.connection.readyState === 1,
      demoRequestsPerMinute: 10,
      requestsPerMinute: 120,
      timestamp: new Date().toISOString(),
    });
  });
  app.get('/api/presets', (req, res) =>
    res.json({ success: true, data: DEMO_TARGETS }),
  );
  if (!proxyOnly) app.use('/api', userRouter);
  app.get('/', (req, res) =>
    res.json({
      service: 'EduCors API',
      version: VERSION,
      documentation: '/documentation',
    }),
  );
  app.use((req, res) =>
    res.status(404).json({ success: false, message: 'Endpoint not found.' }),
  );
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status =
      error.type === 'entity.too.large'
        ? 413
        : error.type === 'entity.parse.failed'
          ? 400
          : error.statusCode || 500;
    res.status(status).json({
      success: false,
      message:
        status === 500
          ? 'Something went wrong. Please try again.'
          : status === 413
            ? 'Request body is too large.'
            : status === 400 && error.type === 'entity.parse.failed'
              ? 'The request body contains invalid JSON.'
              : error.message,
    });
  });
  return app;
}
export default createApp();
