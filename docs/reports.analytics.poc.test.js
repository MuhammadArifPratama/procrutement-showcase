const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

const dbConfigured = !!(process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST);

describe('Reports & Analytics PoC integration tests', () => {
  if (!dbConfigured) {
    test('skipped because DB not configured', () => {
      console.warn('Skipping reports/analytics PoC tests because DB environment is not configured');
    });
    return;
  }

  let agent;
  let vendorId;

  beforeAll(async () => {
    agent = request.agent(app);
    await agent
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'admin123' })
      .expect(200);

    const vendorRes = await agent.get('/api/vendors').expect(200);
    const vendors = vendorRes.body;
    if (vendors && vendors.length > 0) {
      vendorId = vendors[0].id;
    }
  });

  test('GET /api/analytics/kpi returns KPI metrics', async () => {
    const res = await agent.get('/api/analytics/kpi').expect(200);
    expect(res.body).toHaveProperty('totalSavings');
    expect(res.body).toHaveProperty('cycleTime');
    expect(res.body).toHaveProperty('activeVendors');
    expect(res.body).toHaveProperty('complianceRate');
  });

  test('GET /api/analytics/spend-by-category returns category data', async () => {
    const res = await agent.get('/api/analytics/spend-by-category').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('value');
    }
  });

  test('GET /api/analytics/top-vendors returns vendor data', async () => {
    const res = await agent.get('/api/analytics/top-vendors').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('value');
    }
  });

  test('GET /api/analytics/recent-audit returns audit logs', async () => {
    const res = await agent.get('/api/analytics/recent-audit').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('actor_username');
      expect(res.body[0]).toHaveProperty('action');
      expect(res.body[0]).toHaveProperty('created_at');
    }
  });

  test('GET /api/analytics/consent-status returns consent summary', async () => {
    const res = await agent.get('/api/analytics/consent-status').expect(200);
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('consented');
    expect(res.body).toHaveProperty('percentage');
  });

  test('GET /api/compliance/privacy-notice returns privacy notice', async () => {
    const res = await agent.get('/api/compliance/privacy-notice').expect(200);
    expect(res.body).toHaveProperty('content');
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('is_active');
  });

  test('POST /api/compliance/consent records consent', async () => {
    const res = await agent
      .post('/api/compliance/consent')
      .send({ consent_type: 'marketing', consent_given: true, consent_text: 'I agree to marketing emails' })
      .expect(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /api/compliance/my-data returns user personal data', async () => {
    const res = await agent.get('/api/compliance/my-data').expect(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('consents');
  });

  test('POST /api/compliance/delete-request submits deletion request', async () => {
    const res = await agent
      .post('/api/compliance/delete-request')
      .send({ reason: 'PoC test deletion request' })
      .expect(200);
    expect(res.body).toHaveProperty('message');
  });

  test('Analytics endpoints return data in expected shape', async () => {
    const kpiRes = await agent.get('/api/analytics/kpi').expect(200);
    expect(typeof kpiRes.body.totalSavings).toBe('number');
    expect(typeof kpiRes.body.cycleTime).toBe('string');
    expect(typeof kpiRes.body.activeVendors).toBe('number');
    expect(typeof kpiRes.body.complianceRate).toBe('string');
  });

  test('Spend by category data is sorted descending by value', async () => {
    const res = await agent.get('/api/analytics/spend-by-category').expect(200);
    if (res.body.length > 1) {
      for (let i = 0; i < res.body.length - 1; i++) {
        expect(res.body[i].value).toBeGreaterThanOrEqual(res.body[i + 1].value);
      }
    }
  });

  test('Top vendors data is sorted descending by value', async () => {
    const res = await agent.get('/api/analytics/top-vendors').expect(200);
    if (res.body.length > 1) {
      for (let i = 0; i < res.body.length - 1; i++) {
        expect(res.body[i].value).toBeGreaterThanOrEqual(res.body[i + 1].value);
      }
    }
  });

  test('Consent status totals are non-negative integers', async () => {
    const res = await agent.get('/api/analytics/consent-status').expect(200);
    expect(res.body.total).toBeGreaterThanOrEqual(0);
    expect(res.body.consented).toBeGreaterThanOrEqual(0);
    expect(res.body.consented).toBeLessThanOrEqual(res.body.total);
  });

  test('Audit logs are ordered by created_at descending', async () => {
    const res = await agent.get('/api/analytics/recent-audit').expect(200);
    if (res.body.length > 1) {
      const first = new Date(res.body[0].created_at);
      const second = new Date(res.body[1].created_at);
      expect(first.getTime()).toBeGreaterThanOrEqual(second.getTime());
    }
  });

  afterAll(async () => {
    if (agent) {
      await agent.post('/api/auth/logout').catch(() => {});
    }
    await pool.end().catch(() => {});
  });
});
