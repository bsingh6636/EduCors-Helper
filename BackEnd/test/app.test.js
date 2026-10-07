import { after, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import net from 'node:net';
import { gzipSync } from 'node:zlib';
import { setTimeout as delay } from 'node:timers/promises';
import request from 'supertest';
import mongoose from 'mongoose';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET_KEY =
  'educors-integration-test-secret-for-local-tests-only';
let mongo,
  directory,
  app,
  alice,
  bob,
  key,
  User,
  ApiUsage,
  safe,
  limiter,
  forwarder,
  captured;
before(async () => {
  if (!process.env.EDUCORS_TEST_MONGO_URI) {
    directory = await mkdtemp(join(tmpdir(), 'educors-test-'));
    const port = await new Promise((resolve) => {
      const server = net.createServer();
      server.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        server.close(() => resolve(port));
      });
    });
    process.env.MONGO_SRV = 'mongodb://127.0.0.1:' + port + '/educors_test';
    mongo = spawn(
      process.env.MONGOD_BINARY || 'mongod',
      [
        '--port',
        String(port),
        '--bind_ip',
        '127.0.0.1',
        '--dbpath',
        directory,
        '--quiet',
      ],
      { stdio: 'ignore' },
    );
    let startupError;
    mongo.on('error', (error) => {
      startupError = error;
    });
    for (let attempt = 0; attempt < 60; attempt++) {
      if (startupError)
        throw new Error(
          'Install mongod or set EDUCORS_TEST_MONGO_URI (see README).',
        );
      const reachable = await new Promise((resolve) => {
        const socket = net.connect(port, '127.0.0.1');
        socket.once('connect', () => {
          socket.destroy();
          resolve(true);
        });
        socket.once('error', () => resolve(false));
      });
      if (reachable) break;
      if (attempt === 59)
        throw new Error('Temporary test MongoDB did not start.');
      await delay(100);
    }
  } else {
    const url = new URL(process.env.EDUCORS_TEST_MONGO_URI);
    assert.match(
      url.pathname,
      /test/i,
      'Test database name must contain "test".',
    );
    process.env.MONGO_SRV = process.env.EDUCORS_TEST_MONGO_URI;
  }
  const { connectDatabase } = await import('../database.js');
  await connectDatabase();
  User = (await import('../models/user.model.js')).default;
  ApiUsage = (await import('../models/apiUsage.schema.js')).default;
  await Promise.all([User.init(), ApiUsage.init()]);
  safe = await import('../helper/safeTarget.js');
  limiter = await import('../middleware/rateLimit.js');
  const { createForwarder } =
    await import('../controller/forward.controller.js');
  const { createApp } = await import('../app.js');
  forwarder = createForwarder({
    resolve: (url) =>
      safe.resolveTarget(url, async () => [
        { address: '93.184.215.14', family: 4 },
      ]),
    request: async (config) => {
      captured = config;
      if (config.url.includes('/timeout'))
        throw Object.assign(new Error('Timeout'), { code: 'ECONNABORTED' });
      if (config.url.includes('/redirect'))
        return {
          status: 302,
          headers: { location: 'http://127.0.0.1/' },
          data: Buffer.from(''),
        };
      if (config.url.includes('/html'))
        return {
          status: 200,
          headers: { 'content-type': 'text/html' },
          data: Buffer.from('<p>hi</p>'),
        };
      if (config.url.includes('/binary'))
        return {
          status: 200,
          headers: {
            'content-type': 'application/octet-stream',
            'set-cookie': 'secret=value',
          },
          data: Buffer.from([0, 255, 128, 4]),
        };
      return {
        status: config.url.includes('/missing') ? 404 : 200,
        headers: {
          'content-type': 'application/json',
          'set-cookie': 'secret=value',
        },
        data: Buffer.from(
          JSON.stringify({
            method: config.method,
            body: config.data?.toString() || null,
          }),
        ),
      };
    },
  });
  app = createApp({ forwarder });
  alice = request.agent(app);
  bob = request.agent(app);
  const signed = await alice.post('/api/signUp').send({
    Name: 'Alice Developer',
    UserName: 'alice',
    Email: 'alice@example.com',
    Password: 'long-passphrase-one',
  });
  assert.equal(signed.status, 201);
  key = signed.body.data.ApiKey;
  const other = await bob.post('/api/signUp').send({
    Name: 'Bob Developer',
    UserName: 'bob',
    Email: 'bob@example.com',
    Password: 'long-passphrase-two',
  });
  assert.equal(other.status, 201);
});
beforeEach(() => {
  limiter?.authRateLimit.clear();
  limiter?.demoRateLimit.clear();
  limiter?.clientRateLimit.clear();
  limiter?.proxyRateLimit.clear();
});
after(async () => {
  if (
    process.env.EDUCORS_TEST_MONGO_URI &&
    mongoose.connection.readyState === 1
  )
    await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if (mongo && mongo.exitCode === null && !mongo.killed) {
    const exited = new Promise((resolve) => mongo.once('exit', resolve));
    mongo.kill('SIGTERM');
    await exited;
  }
  if (directory) await rm(directory, { recursive: true, force: true });
});

test('health reports actual account readiness', async () => {
  const result = await request(app).get('/api/health');
  assert.equal(result.status, 200);
  assert.equal(result.body.accountsReady, true);
  assert.equal(result.body.requestsPerMinute, 120);
});
test('signup gives a hashed password and initial key without leaking password or JWT', async () => {
  const result = await alice.get('/api/auth');
  assert.equal(result.status, 200);
  assert.equal(result.body.data.Password, undefined);
  assert.match(result.body.data.ApiKey, /^ec_[a-f0-9]{48}$/);
  const stored = await User.findOne({ UserName: 'alice' }).select('+Password');
  assert.match(stored.Password, /^\$2[aby]\$/);
});
test('duplicate signup returns a useful conflict', async () => {
  const result = await request(app).post('/api/signUp').send({
    Name: 'Other Alice',
    UserName: 'alice',
    Email: 'different@example.com',
    Password: 'long-passphrase',
  });
  assert.equal(result.status, 409);
});
test('signup accepts plain passphrases but rejects invalid inputs', async () => {
  const result = await request(app).post('/api/signUp').send({
    Name: 'Al',
    UserName: 'invalid user',
    Email: 'not-email',
    Password: 'short',
  });
  assert.equal(result.status, 400);
});
test('sign in succeeds for normalized email and sets HTTP-only session', async () => {
  const result = await request(app).post('/api/signIn').send({
    UserNameorEmail: ' ALICE@EXAMPLE.COM ',
    Password: 'long-passphrase-one',
  });
  assert.equal(result.status, 200);
  assert.match(result.headers['set-cookie'][0], /HttpOnly/);
  assert.equal(result.body.token, undefined);
});
test('incorrect passwords and unknown users share a non-enumerating response', async () => {
  const results = await Promise.all(
    ['alice', 'nobody'].map((name) =>
      request(app)
        .post('/api/signIn')
        .send({ UserNameorEmail: name, Password: 'wrong-password' }),
    ),
  );
  assert.equal(results[0].status, 401);
  assert.equal(results[1].status, 401);
  assert.equal(results[0].body.message, results[1].body.message);
});
test('usage is protected by a login session', async () => {
  assert.equal((await request(app).get('/api/apiUsage')).status, 401);
});
test('demo presets work without an account', async () => {
  const result = await request(app)
    .get('/api/getData')
    .query({ Target: 'https://jsonplaceholder.typicode.com/posts/1' });
  assert.equal(result.status, 200);
  assert.equal(result.headers['x-educors-mode'], 'demo');
  assert.equal(result.headers['access-control-allow-origin'], '*');
});
test('custom URLs require a key and unknown keys are rejected', async () => {
  assert.equal(
    (
      await request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/data' })
    ).status,
    401,
  );
  assert.equal(
    (
      await request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/data' })
        .set('x-api-key', 'bad')
    ).status,
    401,
  );
});
test('a supplied invalid key cannot fall back to anonymous demo access', async () => {
  const result = await request(app)
    .get('/api/getData')
    .query({ Target: 'https://jsonplaceholder.typicode.com/posts/1' })
    .set('x-api-key', 'invalid-key');
  assert.equal(result.status, 401);
  assert.match(result.body.message, /Invalid API key/);
});
test('missing and malformed targets are rejected before forwarding', async () => {
  for (const Target of ['', 'not-a-url', 'ftp://example.com/data']) {
    const result = await request(app).get('/api/getData').query({ Target });
    assert.equal(result.status, 400);
    assert.match(result.body.message, /URL|HTTP/);
  }
});
test('the limited demo cannot be expanded using methods or query strings', async () => {
  assert.equal(
    (
      await request(app)
        .delete('/api/getData')
        .query({ Target: 'https://jsonplaceholder.typicode.com/posts/1' })
    ).status,
    401,
  );
  assert.equal(
    (
      await request(app).get('/api/getData').query({
        Target: 'https://jsonplaceholder.typicode.com/posts/1?extra=1',
      })
    ).status,
    401,
  );
});
test('rolling demo limit returns 429 and Retry-After on the eleventh request', async () => {
  for (let i = 0; i < 10; i++)
    assert.equal(
      (
        await request(app)
          .get('/api/getData')
          .query({ Target: 'https://jsonplaceholder.typicode.com/posts/1' })
      ).status,
      200,
    );
  const result = await request(app)
    .get('/api/getData')
    .query({ Target: 'https://jsonplaceholder.typicode.com/posts/1' });
  assert.equal(result.status, 429);
  assert.ok(Number(result.headers['retry-after']) > 0);
});
test('preflight supports arbitrary upstream header names', async () => {
  const result = await request(app)
    .options('/api/getData')
    .set('Origin', 'https://my-app.example')
    .set('Access-Control-Request-Method', 'PATCH')
    .set('Access-Control-Request-Headers', 'x-api-key,x-custom-token');
  assert.equal(result.status, 204);
  assert.match(
    result.headers['access-control-allow-headers'],
    /x-custom-token/,
  );
});
test('the account API refuses untrusted origins', async () => {
  const result = await alice
    .get('/api/auth')
    .set('Origin', 'https://untrusted.example');
  assert.equal(result.status, 403);
});
test('the alternate local development port can access account routes', async () => {
  const result = await request(app)
    .get('/api/auth')
    .set('Origin', 'http://127.0.0.1:5174');
  assert.equal(result.status, 401);
  assert.equal(
    result.headers['access-control-allow-origin'],
    'http://127.0.0.1:5174',
  );
});
test('the proxy preserves raw bodies, including keys named Target and ApiKey', async () => {
  const body = JSON.stringify({
    Target: 'a real payload property',
    ApiKey: 'payload property',
    body: { nested: true },
  });
  const result = await request(app)
    .post('/api/getData')
    .query({ Target: 'https://example.com/echo' })
    .set('x-api-key', key)
    .set('Content-Type', 'application/json')
    .send(body);
  assert.equal(result.status, 200);
  assert.equal(result.body.body, body);
});
test('plain text and binary bodies are forwarded intact', async () => {
  const result = await request(app)
    .put('/api/getData')
    .query({ Target: 'https://example.com/echo' })
    .set('x-api-key', key)
    .set('Content-Type', 'text/plain')
    .send('hello\nworld');
  assert.equal(result.body.body, 'hello\nworld');
});
test('upstream auth is preserved and gateway secrets and cookies are removed', async () => {
  await request(app)
    .get('/api/getData')
    .query({ Target: 'https://example.com/echo' })
    .set('x-api-key', key)
    .set('Authorization', 'Bearer upstream-token')
    .set('Cookie', 'userToken=sensitive')
    .set('Origin', 'https://app.example')
    .set('Connection', 'x-hidden')
    .set('x-hidden', 'do-not-forward')
    .set('x-real-ip', '203.0.113.9')
    .set('cf-connecting-ip', '203.0.113.9')
    .set('x-vercel-forwarded-for', '203.0.113.9')
    .set('true-client-ip', '203.0.113.9')
    .set('via', '1.1 edge');
  assert.equal(captured.headers.authorization, 'Bearer upstream-token');
  for (const name of [
    'x-api-key',
    'cookie',
    'origin',
    'connection',
    'x-hidden',
    'x-real-ip',
    'cf-connecting-ip',
    'x-vercel-forwarded-for',
    'true-client-ip',
    'via',
  ])
    assert.equal(captured.headers[name], undefined, name);
  assert.equal(captured.maxRedirects, 0);
  assert.equal(captured.proxy, false);
});
test('Authorization always goes to the target and is never read as a gateway key', async () => {
  assert.equal(
    (
      await request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/echo' })
        .set('Authorization', 'Bearer ' + key)
    ).status,
    401,
  );
  const demo = await request(app)
    .get('/api/getData')
    .query({ Target: 'https://api.github.com/users/octocat' })
    .set('Authorization', 'Bearer ghp_upstream');
  assert.equal(demo.status, 200);
  assert.equal(captured.headers.authorization, 'Bearer ghp_upstream');
});
test('keys in the query string or a JSON body target are not accepted', async () => {
  assert.equal(
    (
      await request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/echo', ApiKey: key })
    ).status,
    401,
  );
  const result = await request(app)
    .post('/api/getData')
    .set('Content-Type', 'application/json')
    .send({ Target: 'https://example.com/echo', ApiKey: key });
  assert.equal(result.status, 400);
  assert.match(result.body.message, /Target URL is required/);
});
test('compressed request bodies are forwarded decompressed without Content-Encoding', async () => {
  const result = await request(app)
    .post('/api/getData')
    .query({ Target: 'https://example.com/echo' })
    .set('x-api-key', key)
    .set('Content-Type', 'text/plain')
    .set('Content-Encoding', 'gzip')
    .send(gzipSync('compressed text'));
  assert.equal(result.status, 200);
  assert.equal(result.body.body, 'compressed text');
  assert.equal(captured.headers['content-encoding'], undefined);
});
test('the upstream Content-Type is passed through without an added charset', async () => {
  const result = await request(app)
    .get('/api/getData')
    .query({ Target: 'https://example.com/html' })
    .set('x-api-key', key);
  assert.equal(result.headers['content-type'], 'text/html');
});
test('key validation reads only the x-api-key header', async () => {
  assert.equal(
    (await request(app).get('/api/validateKey').set('x-api-key', key)).status,
    200,
  );
  assert.equal(
    (await request(app).get('/api/validateKey').set('x-api-key', 'guess'))
      .status,
    401,
  );
  assert.equal(
    (await request(app).get('/api/validateKey').query({ ApiKey: key })).status,
    400,
  );
});
test('upstream error codes are preserved and upstream cookies are not set', async () => {
  const result = await request(app)
    .get('/api/getData')
    .query({ Target: 'https://example.com/missing' })
    .set('x-api-key', key);
  assert.equal(result.status, 404);
  assert.equal(result.headers['set-cookie'], undefined);
  assert.match(result.headers['content-security-policy'], /sandbox/);
});
test('binary responses remain byte-for-byte intact', async () => {
  const result = await request(app)
    .get('/api/getData')
    .query({ Target: 'https://example.com/binary' })
    .set('x-api-key', key);
  assert.deepEqual(result.body, Buffer.from([0, 255, 128, 4]));
});
test('redirects are rejected and upstream timeouts become 504', async () => {
  assert.equal(
    (
      await request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/redirect' })
        .set('x-api-key', key)
    ).status,
    502,
  );
  assert.equal(
    (
      await request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/timeout' })
        .set('x-api-key', key)
    ).status,
    504,
  );
});
test('oversized request bodies are rejected before forwarding', async () => {
  const result = await request(app)
    .post('/api/getData')
    .query({ Target: 'https://example.com/echo' })
    .set('x-api-key', key)
    .set('Content-Type', 'text/plain')
    .send('x'.repeat(1024 * 1024 + 1));
  assert.equal(result.status, 413);
});
test('usage updates remain atomic for concurrent requests and remove sensitive query strings', async () => {
  const owner = await User.findOne({ UserName: 'alice' });
  const before = await ApiUsage.findOne({ UserName: owner._id });
  await Promise.all(
    Array.from({ length: 8 }, () =>
      request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/echo?token=sensitive' })
        .set('x-api-key', key),
    ),
  );
  const usage = await alice.get('/api/apiUsage');
  assert.equal(usage.body.totalApiCalls, (before?.totalApiCalls || 0) + 8);
  assert.equal(usage.body.days.length, 7);
  assert.ok(usage.body.recentLogs.every((log) => !log.endpoint.includes('?')));
});
test('another user cannot read usage by passing a userId', async () => {
  const owner = await User.findOne({ UserName: 'alice' });
  const result = await bob.post('/api/apiUsage').send({ userId: owner._id });
  assert.equal(result.body.totalApiCalls, 0);
});
test('rotation ignores arbitrary usernames, changes only the current key, and revokes the old one', async () => {
  const b = await User.findOne({ UserName: 'bob' });
  const original = b.ApiKey;
  const rotated = await alice
    .post('/api/regenerateApiKey')
    .send({ UserName: 'bob' });
  assert.equal(rotated.status, 200);
  assert.notEqual(rotated.body.data, key);
  assert.equal((await User.findOne({ UserName: 'bob' })).ApiKey, original);
  assert.equal(
    (
      await request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/echo' })
        .set('x-api-key', key)
    ).status,
    401,
  );
  key = rotated.body.data;
  assert.equal(
    (
      await request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/echo' })
        .set('x-api-key', key)
    ).status,
    200,
  );
});
test('local, encoded, mapped, reserved, and non-HTTP targets are blocked', async () => {
  for (const target of [
    'http://127.0.0.1/',
    'http://2130706433/',
    'http://0x7f000001/',
    'http://[::1]/',
    'http://[::ffff:127.0.0.1]/',
    'http://10.0.0.1/',
    'http://192.168.1.1/',
    'http://169.254.169.254/',
    'http://100.64.0.1/',
    'http://localhost/',
    'http://service.local/',
    'ftp://example.com/file',
    'https://user:pass@example.com/',
    'https://example.com:8443/',
  ]) {
    const result = await request(app)
      .get('/api/getData')
      .query({ Target: target });
    assert.equal(result.status, 400, target);
  }
});
test('DNS destinations are checked, including mixed public/private answers', async () => {
  for (const answers of [
    [{ address: '127.0.0.1', family: 4 }],
    [
      { address: '93.184.215.14', family: 4 },
      { address: '10.0.0.1', family: 4 },
    ],
  ]) {
    await assert.rejects(
      () =>
        safe.resolveTarget(new URL('https://example.com'), async () => answers),
      /private or reserved/,
    );
  }
});
test('the agent lookup reuses validated addresses without re-resolving DNS', async () => {
  let calls = 0;
  const lookup = await safe.resolveTarget(
    new URL('https://example.com'),
    async () => {
      calls++;
      return [{ address: '93.184.215.14', family: 4 }];
    },
  );
  const address = await new Promise((resolve, reject) =>
    lookup('example.com', {}, (error, address) =>
      error ? reject(error) : resolve(address),
    ),
  );
  assert.equal(address, '93.184.215.14');
  assert.equal(calls, 1);
});

test('rate limits group an IPv6 /64 and evict old clients instead of refusing new ones', () => {
  const limit = limiter.createRateLimiter({ limit: 1, maxKeys: 2 });
  const hit = (ip) => {
    const res = {
      set: () => res,
      status: (code) => ((res.statusCode = code), res),
      json: () => res,
    };
    let passed = false;
    limit({ ip }, res, () => (passed = true));
    return passed ? 200 : res.statusCode;
  };
  assert.equal(hit('2001:db8:1:2::1'), 200);
  assert.equal(hit('2001:db8:1:2::ffff'), 429);
  assert.equal(hit('198.51.100.1'), 200);
  assert.equal(hit('198.51.100.2'), 200);
  assert.equal(hit('198.51.100.3'), 200);
});
test('the server reports a port that is already in use instead of claiming success', async () => {
  const busy = net.createServer();
  await new Promise((resolve) => busy.listen(0, '127.0.0.1', resolve));
  process.env.PORT = String(busy.address().port);
  try {
    const { startServer } = await import('../server.js');
    await assert.rejects(startServer(), /EADDRINUSE/);
  } finally {
    delete process.env.PORT;
    await new Promise((resolve) => busy.close(resolve));
  }
});
test('an unsupported forwarding method returns 405', async () => {
  const result = await request(app)
    .trace('/api/getData')
    .query({ Target: 'https://example.com/echo' })
    .set('x-api-key', key);
  assert.equal(result.status, 405);
  assert.match(result.headers.allow, /GET/);
});
test('the first parallel requests for a new account are counted without lost upserts', async () => {
  const signup = await request(app).post('/api/signUp').send({
    Name: 'Concurrent Tester',
    UserName: 'concurrent',
    Email: 'concurrent@example.com',
    Password: 'long-test-passphrase',
  });
  const newKey = signup.body.data.ApiKey;
  const results = await Promise.all(
    Array.from({ length: 8 }, () =>
      request(app)
        .get('/api/getData')
        .query({ Target: 'https://example.com/echo' })
        .set('x-api-key', newKey),
    ),
  );
  assert.ok(results.every((result) => result.status === 200));
  const usage = await ApiUsage.findOne({ UserName: signup.body.data._id });
  assert.equal(usage.totalApiCalls, 8);
});
test('HEAD requests preserve status and headers with no response body', async () => {
  const result = await request(app)
    .head('/api/getData')
    .query({ Target: 'https://example.com/echo' })
    .set('x-api-key', key);
  assert.equal(result.status, 200);
  assert.equal(result.text, undefined);
  assert.match(result.headers['content-type'], /application\/json/);
});

test('a proxy-only deployment forwards requests and logs usage but serves no account routes', async () => {
  const { createApp } = await import('../app.js');
  const proxy = createApp({ forwarder, proxyOnly: true });
  assert.equal((await request(proxy).get('/api/health')).body.role, 'proxy');
  assert.equal(
    (
      await request(proxy)
        .post('/api/signIn')
        .send({ UserNameorEmail: 'alice', Password: 'long-passphrase-one' })
    ).status,
    404,
  );
  const owner = await User.findOne({ UserName: 'alice' });
  const before = (await ApiUsage.findOne({ UserName: owner._id })).totalApiCalls;
  const result = await request(proxy)
    .get('/api/getData')
    .query({ Target: 'https://example.com/echo' })
    .set('x-api-key', key);
  assert.equal(result.status, 200);
  assert.equal(
    (await ApiUsage.findOne({ UserName: owner._id })).totalApiCalls,
    before + 1,
  );
});
test('logout clears the session and protected endpoints reject it', async () => {
  assert.equal((await alice.post('/api/signOut')).status, 200);
  assert.equal((await alice.get('/api/auth')).status, 401);
});
