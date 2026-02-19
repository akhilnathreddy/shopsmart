import { http, HttpResponse } from 'msw';

// Default mock API responses
export const mockHealthResponse = {
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: '2026-01-01T00:00:00.000Z',
};

export const handlers = [
    // GET /api/health — returns backend health status
    http.get('/api/health', () => {
        return HttpResponse.json(mockHealthResponse);
    }),
];
