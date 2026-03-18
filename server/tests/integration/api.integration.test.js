/**
 * Backend Integration Tests
 *
 * These tests exercise the REAL Express app (no mocking).
 * supertest binds the app to an ephemeral port for each request,
 * so no server process needs to be running externally.
 *
 * Purpose: validate the complete HTTP stack — routing, middleware,
 * response serialisation — for every public API endpoint.
 */

const request = require('supertest');
const app = require('../../src/app');

// ─────────────────────────────────────────────
// Health Endpoint
// ─────────────────────────────────────────────
describe('[Integration] GET /api/health', () => {
    it('responds 200 with status "ok"', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    it('includes a message and ISO timestamp', async () => {
        const res = await request(app).get('/api/health');
        expect(res.body.message).toBeTruthy();
        expect(new Date(res.body.timestamp).toISOString()).toBe(res.body.timestamp);
    });

    it('responds with JSON content-type', async () => {
        const res = await request(app).get('/api/health');
        expect(res.headers['content-type']).toMatch(/application\/json/);
    });
});

// ─────────────────────────────────────────────
// Products Endpoint
// ─────────────────────────────────────────────
describe('[Integration] GET /api/products', () => {
    let productsRes;

    // Single shared request — avoids the 500 ms delay 6 times
    beforeAll(async () => {
        productsRes = await request(app).get('/api/products');
    });

    it('responds 200', () => {
        expect(productsRes.statusCode).toBe(200);
    });

    it('returns a JSON array', () => {
        expect(productsRes.headers['content-type']).toMatch(/application\/json/);
        expect(Array.isArray(productsRes.body)).toBe(true);
    });

    it('returns exactly 6 products', () => {
        expect(productsRes.body).toHaveLength(6);
    });

    it('every product has the required fields with correct types', () => {
        productsRes.body.forEach((product) => {
            expect(typeof product.id).toBe('number');
            expect(typeof product.title).toBe('string');
            expect(typeof product.price).toBe('number');
            expect(typeof product.image).toBe('string');
            expect(typeof product.category).toBe('string');
        });
    });

    it('all prices are positive', () => {
        productsRes.body.forEach((product) => {
            expect(product.price).toBeGreaterThan(0);
        });
    });

    it('all product ids are unique', () => {
        const ids = productsRes.body.map((p) => p.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });

    it('is idempotent — second call returns the same data', async () => {
        const res2 = await request(app).get('/api/products');
        expect(res2.body).toEqual(productsRes.body);
    });
});

// ─────────────────────────────────────────────
// Unknown Routes
// ─────────────────────────────────────────────
describe('[Integration] Unknown routes', () => {
    it('GET /api/nonexistent returns 404', async () => {
        const res = await request(app).get('/api/nonexistent');
        expect(res.statusCode).toBe(404);
    });
});
