import app from './app.js';
import mongoose from 'mongoose';
import { connectDatabase } from './database.js';
import { getJwtSecret, isProxyOnly } from './envHelper.js';

export async function startServer() {
  // Proxy-only deployments have no sign-in, so they don't need a session secret.
  if (!isProxyOnly) getJwtSecret();
  await connectDatabase().catch(() =>
    console.warn(
      'Account storage is unavailable. The public demo remains available.',
    ),
  );
  const port = Number(process.env.PORT || 9090);
  // Express 5 passes listen errors such as EADDRINUSE to this callback instead of throwing.
  const server = await new Promise((resolve, reject) => {
    const server = app.listen(
      port,
      process.env.LISTEN_HOST ||
        (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1'),
      (error) => (error ? reject(error) : resolve(server)),
    );
  });
  console.log('EduCors API listening on http://localhost:' + port);
  const shutdown = () =>
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  return server;
}
