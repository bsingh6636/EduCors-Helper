import { config } from 'dotenv';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

config({
  path: fileURLToPath(new URL('./.env', import.meta.url)),
  quiet: true,
});
config({
  path: fileURLToPath(new URL('./config.env', import.meta.url)),
  quiet: true,
});

export const isProduction = process.env.NODE_ENV === 'production';
// API_ROLE=proxy runs a deployment that only forwards API requests, keeping that load off the account API.
export const isProxyOnly = process.env.API_ROLE === 'proxy';
export const FRONTENDURL = [
  'https://cors-proxy.brijeshhq.com',
  'https://cors-proxy.brijeshdev.space',
  'https://cors-proxy.brijeshkushwaha.com.np',
  'https://cors-proxy2.brijeshkushwaha.com.np',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4174',
  'http://127.0.0.1:4174',
  ...(!isProduction ? ['http://localhost:5174', 'http://127.0.0.1:5174'] : []),
  ...(process.env.FRONTEND_URL || process.env.FRONTEND_PORT || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
];
const developmentSecret = randomBytes(48).toString('hex');
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET_KEY;
  if (isProduction && (!secret || secret.length < 32)) {
    throw Object.assign(
      new Error(
        'Account sessions are not configured. Set JWT_SECRET_KEY to a random value of at least 32 characters.',
      ),
      { statusCode: 503 },
    );
  }
  return secret || developmentSecret;
}
export const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite:
    process.env.COOKIE_SAME_SITE === 'none' && isProduction ? 'none' : 'lax',
  path: '/',
};
export const SESSION_DAYS = 7;
export const VERSION = '3.0.0';
