const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('timestamp');
    });
});

describe('GET /api/products', () => {
    it('should return 200 with an array of products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should return 6 products', async () => {
        const res = await request(app).get('/api/products');
        expect(res.body).toHaveLength(6);
    });

    it('each product should have required fields', async () => {
        const res = await request(app).get('/api/products');
        res.body.forEach((product) => {
            expect(product).toHaveProperty('id');
            expect(product).toHaveProperty('title');
            expect(product).toHaveProperty('price');
            expect(product).toHaveProperty('image');
            expect(product).toHaveProperty('category');
        });
    });

    it('prices should be positive numbers', async () => {
        const res = await request(app).get('/api/products');
        res.body.forEach((product) => {
            expect(typeof product.price).toBe('number');
            expect(product.price).toBeGreaterThan(0);
        });
    });
});
