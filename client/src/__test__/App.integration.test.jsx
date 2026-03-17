import { render, screen, waitFor } from './test-utils';
import { http, HttpResponse } from 'msw';
import { server } from '../__mocks__/server';
import App from '../App';
import { describe, it, expect } from 'vitest';

describe('App — Integration Tests (API interaction flows)', () => {
    it('completes full render → fetch → display cycle on success', async () => {
        render(<App />);

        // 1. Initial loading state
        expect(screen.getByText(/Loading premium products.../i)).toBeInTheDocument();

        // 2. After MSW responds, data should be displayed
        await waitFor(() => {
            expect(screen.getByText(/Premium Wireless Headphones/i)).toBeInTheDocument();
        });

        // 3. Verify ProductCard content is rendered
        expect(screen.getByText(/\$299.99/i)).toBeInTheDocument();
        expect(screen.getByText(/Minimalist Smartwatch/i)).toBeInTheDocument();
    });

    it('handles server error (500) without crashing', async () => {
        server.use(
            http.get('/api/products', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        render(<App />);

        // Give it time to attempt the fetch and fail
        await waitFor(
            () => {
                expect(screen.queryByText(/Loading premium products.../i)).not.toBeInTheDocument();
            },
            { timeout: 2000 }
        );

        // Ensure no crash — Navbar and Hero title are still visible
        expect(screen.getByText(/Unleash Your Style/i)).toBeInTheDocument();
        expect(screen.queryAllByText(/Add to Cart/i).length).toBe(0);
    });

    it('handles network failure without crashing', async () => {
        server.use(
            http.get('/api/products', () => {
                return HttpResponse.error();
            })
        );

        render(<App />);

        await waitFor(
            () => {
                expect(screen.queryByText(/Loading premium products.../i)).not.toBeInTheDocument();
            },
            { timeout: 2000 }
        );

        // App still renders, no uncaught error
        expect(screen.getByText(/SHOPSMART/i)).toBeInTheDocument();
    });

    it('displays correct data when API returns custom values', async () => {
        server.use(
            http.get('/api/products', () => {
                return HttpResponse.json([
                    { id: 99, title: 'Limited Edition Sneakers', price: 450.00, image: 'sneakers.jpg', category: 'Footwear' }
                ]);
            })
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/Limited Edition Sneakers/i)).toBeInTheDocument();
        });

        expect(screen.getByText(/\$450.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Footwear/i)).toBeInTheDocument();
    });
});
