import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('GET /api/products/stats', () => {
  it('상태별 카운트와 합계 100을 반환한다', async () => {
    const res = await request(app).get('/api/products/stats');
    expect(res.status).toBe(200);
    const { total, selling, outOfStock, discontinued } = res.body;
    expect(total).toBe(100);
    expect(selling).toBe(62);
    expect(outOfStock).toBe(28);
    expect(discontinued).toBe(10);
    expect(selling + outOfStock + discontinued).toBe(total);
  });
});

describe('GET /api/products', () => {
  it('page=1 pageSize=10 → items 10개, total 100', async () => {
    const res = await request(app).get('/api/products?page=1&pageSize=10');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(10);
    expect(res.body.total).toBe(100);
    expect(res.body.page).toBe(1);
  });

  it('page=10 → 마지막 페이지 10건', async () => {
    const res = await request(app).get('/api/products?page=10&pageSize=10');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(10);
    expect(res.body.page).toBe(10);
  });

  it('page=0 → 400', async () => {
    const res = await request(app).get('/api/products?page=0');
    expect(res.status).toBe(400);
  });

  it('pageSize=200 → 400', async () => {
    const res = await request(app).get('/api/products?pageSize=200');
    expect(res.status).toBe(400);
  });

  it('page=abc → 400', async () => {
    const res = await request(app).get('/api/products?page=abc');
    expect(res.status).toBe(400);
  });
});
