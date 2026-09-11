import axios from 'axios';
import http from 'node:http';
import https from 'node:https';
import User from '../models/user.model.js';
import ApiUsage from '../models/apiUsage.schema.js';
import { connectDatabase } from '../database.js';
import { API_KEY_PATTERN } from './user.controller.js';
import { parseTarget, resolveTarget } from '../helper/safeTarget.js';
import { demoRateLimit, proxyRateLimit } from '../middleware/rateLimit.js';

export const DEMO_TARGETS = [
  { method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts/1' },
  { method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts' },
  { method: 'GET', url: 'https://api.github.com/users/octocat' },
  { method: 'GET', url: 'https://dog.ceo/api/breeds/image/random' },
];
const blockedHeaders = new Set([
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'content-length',
  'cookie',
  'x-api-key',
  'origin',
  'referer',
  'forwarded',
  'accept-encoding',
  // express.raw has already decompressed the body.
  'content-encoding',
  'expect',
  'via',
  'cdn-loop',
  'x-real-ip',
  'true-client-ip',
  'x-client-ip',
  'x-cluster-client-ip',
  'fastly-client-ip',
]);
// Browser metadata and headers added by hosting platforms, some of which carry the client's IP.
const blockedPrefixes = ['sec-', 'x-forwarded-', 'x-vercel-', 'cf-'];
export function upstreamHeaders(headers) {
  const connectionTokens = String(headers.connection || '')
    .toLowerCase()
    .split(',')
    .map((value) => value.trim());
  return Object.fromEntries(
    Object.entries(headers).filter(([name]) => {
      const lower = name.toLowerCase();
      return (
        !blockedHeaders.has(lower) &&
        !connectionTokens.includes(lower) &&
        !blockedPrefixes.some((prefix) => lower.startsWith(prefix))
      );
    }),
  );
}
export async function VerifyApiKey(req, res, next) {
  try {
    if (
      !['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].includes(req.method)
    ) {
      res.set('Allow', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
      return res.status(405).json({
        success: false,
        message: 'This HTTP method is not supported.',
      });
    }
    const target = req.query.Target || req.query.target || req.query.url;
    if (!target)
      return res.status(400).json({
        success: false,
        message: 'Target URL is required. Use ?Target=https://api.example.com.',
      });
    req.target = parseTarget(target);
    // The gateway key only comes from x-api-key, so Authorization always belongs to the target API.
    const key = req.get('x-api-key');
    if (key) {
      if (API_KEY_PATTERN.test(key)) {
        await connectDatabase();
        req.proxyUser = await User.findOne({ ApiKey: key });
      }
      if (!req.proxyUser)
        return res.status(401).json({
          success: false,
          message:
            'Invalid API key. Check your dashboard for your current key.',
        });
      return proxyRateLimit(req, res, next);
    }
    const demo = DEMO_TARGETS.some(
      (item) => item.url === req.target.href && item.method === req.method,
    );
    if (!demo)
      return res.status(401).json({
        success: false,
        message:
          'An API key is required for custom requests. Create a free account or try a demo preset.',
      });
    req.demo = true;
    return demoRateLimit(req, res, next);
  } catch (error) {
    next(error);
  }
}
export async function recordApiUsage(
  userId,
  target,
  method,
  statusCode,
  latencyMs,
) {
  const day = new Date().toISOString().slice(0, 10);
  const url = new URL(target);
  await ApiUsage.findOneAndUpdate(
    { UserName: userId },
    {
      $inc: { totalApiCalls: 1, ['dailyCounts.' + day]: 1 },
      $push: {
        recentLogs: {
          $each: [
            {
              endpoint: url.origin + url.pathname,
              method,
              statusCode,
              latencyMs,
              timestamp: new Date(),
            },
          ],
          $position: 0,
          $slice: 30,
        },
      },
    },
    { upsert: true },
  );
}
export function createForwarder({
  request = axios,
  resolve = resolveTarget,
} = {}) {
  return async function forwardUrl(req, res, next) {
    const started = performance.now();
    let status = 502;
    const agents = [];
    try {
      const lookup = await resolve(req.target);
      const httpAgent = new http.Agent({ lookup });
      const httpsAgent = new https.Agent({ lookup });
      agents.push(httpAgent, httpsAgent);
      const headers = upstreamHeaders(req.headers);
      headers['user-agent'] = 'EduCors/3.0';
      const config = {
        url: req.target.href,
        method: req.method,
        headers,
        httpAgent,
        httpsAgent,
        proxy: false,
        maxRedirects: 0,
        timeout: 15000,
        maxContentLength: 5 * 1024 * 1024,
        maxBodyLength: 1024 * 1024,
        responseType: 'arraybuffer',
        validateStatus: () => true,
      };
      if (!['GET', 'HEAD'].includes(req.method) && req.body?.length)
        config.data = req.body;
      const upstream = await request(config);
      if (
        upstream.status >= 300 &&
        upstream.status < 400 &&
        upstream.headers.location
      ) {
        throw Object.assign(
          new Error(
            'The target redirected. Use its final URL; redirects are not followed.',
          ),
          { statusCode: 502 },
        );
      }
      status = upstream.status;
      const latencyMs = Math.round(performance.now() - started);
      res.set({
        'X-Proxy-Latency-Ms': String(latencyMs),
        'X-Served-By': 'EduCors',
        'X-EduCors-Mode': req.demo ? 'demo' : 'authenticated',
        'Cache-Control': 'no-store',
        'Content-Security-Policy': "sandbox; default-src 'none'",
      });
      // setHeader passes values through unchanged; res.set would append a charset to Content-Type.
      for (const header of ['content-type', 'etag', 'last-modified']) {
        if (upstream.headers[header])
          res.setHeader(header, upstream.headers[header]);
      }
      if (req.proxyUser)
        await recordApiUsage(
          req.proxyUser._id,
          req.target.href,
          req.method,
          status,
          latencyMs,
        ).catch(() => {});
      return res.status(status).send(Buffer.from(upstream.data));
    } catch (error) {
      status =
        error.statusCode ||
        (['ECONNABORTED', 'ETIMEDOUT'].includes(error.code) ? 504 : 502);
      if (req.proxyUser)
        await recordApiUsage(
          req.proxyUser._id,
          req.target.href,
          req.method,
          status,
          Math.round(performance.now() - started),
        ).catch(() => {});
      if (!error.statusCode)
        error = Object.assign(
          new Error(
            status === 504
              ? 'The upstream request timed out after 15 seconds.'
              : 'The upstream request failed or exceeded the 5 MB response limit.',
          ),
          { statusCode: status },
        );
      next(error);
    } finally {
      agents.forEach((agent) => agent.destroy());
    }
  };
}
export const forwardUrl = createForwarder();

export async function getApiUsage(req, res) {
  const usage = await ApiUsage.findOne({ UserName: req.user._id }).lean();
  const daily = usage?.dailyCounts || {};
  const history = usage?.usageRecords || [];
  const recentLogs = usage?.recentLogs || [];
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - 6 + index);
    const key = date.toISOString().slice(0, 10);
    const old =
      history
        .find((record) => record.month === key.slice(0, 7))
        ?.dailyRecord?.find((record) => record.date === key)?.calls || 0;
    return { date: key, calls: (daily[key] || 0) + old };
  });
  return res.json({
    success: true,
    totalApiCalls: usage?.totalApiCalls || 0,
    days,
    recentLogs,
    averageLatencyMs: recentLogs.length
      ? Math.round(
          recentLogs.reduce((sum, log) => sum + (log.latencyMs || 0), 0) /
            recentLogs.length,
        )
      : null,
  });
}
