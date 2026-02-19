import { render, screen, waitFor } from './test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../__mocks__/server';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App — Integration Tests (API interaction flows)', () => {
    it('completes full render → fetch → display cycle on success', async () => {
        render(<App />);

        // 1. Initial loading state
        expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();

        // 2. After MSW responds, data should be displayed
        await waitFor(() => {
            expect(screen.getByText(/ok/i)).toBeInTheDocument();
        });

        // 3. Verify all three fields are rendered
        expect(screen.getByText(/ShopSmart Backend is running/i)).toBeInTheDocument();
        expect(screen.getByText(/2026-01-01T00:00:00.000Z/i)).toBeInTheDocument();
    });

    it('handles server error (500) without crashing', async () => {
        server.use(
            http.get('/api/health', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        render(<App />);

        // The app should stay in loading state after a 500 error
        // (the fetch .json() call will reject on non-JSON 500)
        // Give it time to attempt the fetch and fail
        await waitFor(
            () => {
                expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();
            },
            { timeout: 2000 }
        );

        // Ensure no crash — title still visible
        expect(screen.getByText(/ShopSmart/i)).toBeInTheDocument();
    });

    it('handles network failure without crashing', async () => {
        server.use(
            http.get('/api/health', () => {
                return HttpResponse.error();
            })
        );

        render(<App />);

        await waitFor(
            () => {
                expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();
            },
            { timeout: 2000 }
        );

        // App still renders, no uncaught error
        expect(screen.getByText(/ShopSmart/i)).toBeInTheDocument();
    });

    it('displays correct data when API returns custom values', async () => {
        server.use(
            http.get('/api/health', () => {
                return HttpResponse.json({
                    status: 'healthy',
                    message: 'All systems operational',
                    timestamp: '2026-06-15T12:30:00.000Z',
                });
            })
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/healthy/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/All systems operational/i)).toBeInTheDocument();
        expect(screen.getByText(/2026-06-15T12:30:00.000Z/i)).toBeInTheDocument();
    });
});
