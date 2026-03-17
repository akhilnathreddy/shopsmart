import { render, screen, waitFor } from './__test__/test-utils';
import { http, HttpResponse } from 'msw';
import { server } from './__mocks__/server';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App — Unit Tests', () => {
    it('renders the ShopSmart logo', () => {
        render(<App />);
        expect(screen.getByText(/SHOPSMART/i)).toBeInTheDocument();
        expect(screen.getByText(/Unleash Your Style/i)).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
        render(<App />);
        expect(screen.getByText(/Loading premium products.../i)).toBeInTheDocument();
    });

    it('displays products after successful API response', async () => {
        render(<App />);

        // Wait for the products data to appear (MSW returns the dummy data)
        await waitFor(() => {
            expect(screen.getByText(/Premium Wireless Headphones/i)).toBeInTheDocument();
        });

        // The loading placeholder should be gone and prices visible
        expect(screen.queryByText(/Loading premium products.../i)).not.toBeInTheDocument();
        expect(screen.getByText(/\$299.99/i)).toBeInTheDocument();
    });

    it('handles API error gracefully', async () => {
        // Override the handler to return an error for this test only
        server.use(
            http.get('/api/products', () => {
                return new HttpResponse(null, { status: 500 });
            })
        );

        render(<App />);

        // Test utility functions will catch this and return empty array.
        // It should render standard wrapper but without product cards.
        await waitFor(() => {
            expect(screen.queryByText(/Loading premium products.../i)).not.toBeInTheDocument();
        });

        const productCards = screen.queryAllByText(/Add to Cart/i);
        expect(productCards.length).toBe(0);
    });
});
