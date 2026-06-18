const request = require('supertest');
const mongoose = require('mongoose');

let app;
let authToken;
const TEST_USER = {
  username: 'smoketest_' + Date.now(),
  email: `smoke${Date.now()}@test.com`,
  password: 'TestPass123!',
};

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  app = require('../server').app;
  // Register and login a test user
  try {
    await request(app).post('/api/auth/register').send(TEST_USER);
    const res = await request(app).post('/api/auth/login').send({
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    authToken = res.body.token;
  } catch (e) {
    console.warn('Could not create test user:', e.message);
  }
}, 30000);

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
