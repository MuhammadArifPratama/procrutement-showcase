const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');

const dbConfigured = !!(process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST);

describe('Vendor integration tests', () => {
  if (!dbConfigured) {
    test('skipped because DB not configured', () => {
      console.warn('Skipping vendor integration tests because DB environment is not configured');
    });
    return;
  }

  let createdVendorId = null;

  test('create vendor without files (JSON)', async () => {
    const res = await request(app)
      .post('/api/vendors')
      .send({
        name: 'Integration Test Vendor',
        email: `int-vendor-${Date.now()}@example.com`,
        phone: '081234567890',
        address: 'Jl. Test No.1',
        npwp: '01.234.567.8-901.000',
        nib: 'NIB-TEST-123',
        tax_status: 'PKP',
        category: 'F&B',
        bank_name: 'Bank Test',
        bank_account: '1234567890',
        bank_owner: 'PT TEST'
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    createdVendorId = res.body.id;
  });

  test('evaluate vendor with low score then terminate (JSON + PDF)', async () => {
    const evalRes = await request(app)
      .post(`/api/vendors/${createdVendorId}/evaluate`)
      .send({ quality: 1, timeliness: 1, compliance: 1, comment: 'Poor' })
      .expect(200);

    expect(evalRes.body).toHaveProperty('rating');
    const rating = parseFloat(evalRes.body.rating);
    expect(rating).toBeLessThan(2.5);

    const termRes = await request(app)
      .post(`/api/vendors/${createdVendorId}/terminate`)
      .expect(200);

    expect(termRes.body).toHaveProperty('success', true);
    expect(termRes.body).toHaveProperty('message', 'Vendor berhasil di-blacklist');

    const pdfRes = await request(app)
      .get(`/api/vendors/${createdVendorId}/terminate/letter`)
      .expect(200);

    expect(pdfRes.headers['content-type']).toContain('application/pdf');
  });

  test('cleanup: soft delete created vendor', async () => {
    const res = await request(app).delete(`/api/vendors/${createdVendorId}`).expect(200);
    expect(res.body).toHaveProperty('message', 'Vendor berhasil dihapus');
  });

  afterAll(async () => {
    await pool.end().catch(() => {});
  });
});
