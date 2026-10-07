import mongoose from 'mongoose';
import './envHelper.js';

mongoose.set('bufferCommands', false);
let pending;
let connected = false;
const unavailable = () =>
  Object.assign(
    new Error('Account storage is unavailable. Please try again shortly.'),
    { statusCode: 503 },
  );
export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return;
  // After the first connection the driver reconnects by itself; connecting again would leak a second client.
  if (connected) throw unavailable();
  if (!pending) {
    const uri =
      process.env.MONGO_SRV ||
      (process.env.NODE_ENV !== 'production'
        ? 'mongodb://127.0.0.1:27017/educors'
        : '');
    if (!uri)
      throw Object.assign(new Error('Account storage is not configured.'), {
        statusCode: 503,
      });
    // Atlas URIs often omit the database name, and the driver would then use "test".
    const namesDatabase = /^mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(uri);
    pending = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 5000,
        ...(!namesDatabase && { dbName: 'educors' }),
      })
      .then(
        () => {
          connected = true;
        },
        () => {
          throw unavailable();
        },
      )
      .finally(() => {
        pending = undefined;
      });
  }
  await pending;
}
export async function requireDatabase(req, res, next) {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
}
