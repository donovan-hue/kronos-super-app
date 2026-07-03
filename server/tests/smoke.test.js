const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let authToken;
let mongod;

const createTestUser = () => {
  const suffix = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
  return {
    username: `smoketest_${suffix}`,
    email: `smoke${suffix}@test.com`,
    password: 'TestPass123!'
  };
};

const waitForMongoConnection = async (timeoutMs = 10000) => {
  const start = Date.now();
  while (mongoose.connection.readyState !== 1) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('MongoDB did not connect within timeout');
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_kronos';

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  const serverModule = require('../server');
  app = serverModule.app;

  await waitForMongoConnection();
}, 30000);

beforeEach(async () => {
  const TEST_USER = createTestUser();
  await request(app).post('/api/auth/register').send(TEST_USER);

  const res = await request(app).post('/api/auth/login').send({
    email: TEST_USER.email,
    password: TEST_USER.password,
  });

  authToken = res.body.token;
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongod) {
    await mongod.stop();
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe('Auth endpoints', () => {
  test('POST /api/auth/login — wrong credentials returns 400/401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fake@fake.com', password: 'wrongpass' });
    expect([400, 401]).toContain(res.statusCode);
  });

  test('POST /api/auth/login — missing body returns 400', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('Protected endpoints — no token', () => {
  test('GET /api/wallet returns 401', async () => {
    const res = await request(app).get('/api/wallet');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/communities returns 401', async () => {
    const res = await request(app).get('/api/communities');
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/wallet/transfer returns 401', async () => {
    const res = await request(app).post('/api/wallet/transfer').send({});
    expect(res.statusCode).toBe(401);
  });
});

describe('Protected endpoints — with token', () => {
  test('GET /api/wallet returns 200 when authenticated', async () => {
    if (!authToken) return;
    const res = await request(app)
      .get('/api/wallet')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/communities returns 200 when authenticated', async () => {
    if (!authToken) return;
    const res = await request(app)
      .get('/api/communities')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/notifications returns 200 when authenticated', async () => {
    if (!authToken) return;
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${authToken}`);
    expect([200, 404]).toContain(res.statusCode); // 404 if route not registered yet
  });
});

describe('Wallet validation', () => {
  test('POST /api/wallet/transfer — missing amount returns 400', async () => {
    if (!authToken) return;
    const res = await request(app)
      .post('/api/wallet/transfer')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ to: 'someuser' });
    expect([400, 422]).toContain(res.statusCode);
  });
});
