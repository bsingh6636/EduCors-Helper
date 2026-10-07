import app from './app.js';
import { startServer } from './server.js';
import { connectDatabase } from './database.js';

if (process.env.VERCEL) connectDatabase().catch(() => {});
else if (process.env.NODE_ENV !== 'test') await startServer();
export default app;
