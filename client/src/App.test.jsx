import { render, screen, waitFor } from './__test__/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from './__mocks__/server';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App — Unit Tests', () => {
    it('renders the ShopSmart title', () => {
        render(<App />);
        expect(screen.getByText(/ShopSmart/i)).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
        render(<App />);
        expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();
    });

    it('displays backend status after successful API response', async () => {
        render(<App />);

        // Wait for the health data to appear (MSW returns the default mock)
        await waitFor(() => {
            expect(screen.getByText(/ok/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/ShopSmart Backend is running/i)).toBeInTheDocument();
    });

    it('handles API error gracefully', async () => {
        // Override the handler to return a 500 for this test only
        server.use(
            http.get('/api/health', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        render(<App />);

        // The component should still render without crashing.
        // It logs an error and stays in loading state (no data).
        await waitFor(() => {
            expect(screen.getByText(/Loading backend status/i)).toBeInTheDocument();
        });
    });
});
