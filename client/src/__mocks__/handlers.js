import { http, HttpResponse } from 'msw';

// Default mock API responses
export const mockHealthResponse = {
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: '2026-01-01T00:00:00.000Z',
};

export const mockProductsResponse = [
    { id: 1, title: 'Premium Wireless Headphones', price: 299.99, image: 'https://example.com/1.jpg', category: 'Electronics' },
    { id: 2, title: 'Minimalist Smartwatch', price: 199.50, image: 'https://example.com/2.jpg', category: 'Wearables' },
];

export const handlers = [
    // GET /api/health — returns backend health status
    http.get('/api/health', () => {
        return HttpResponse.json(mockHealthResponse);
    }),

    // GET /api/products - returns list of products
    http.get('/api/products', () => {
        return HttpResponse.json(mockProductsResponse);
    }),
];
