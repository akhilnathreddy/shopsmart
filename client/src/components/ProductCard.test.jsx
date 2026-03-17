import { render, screen } from '../__test__/test-utils';
import { describe, it, expect } from 'vitest';
import ProductCard from './ProductCard';

describe('ProductCard Component', () => {
    const mockProduct = {
        id: 1,
        title: 'Test Headphones',
        price: 99.99,
        category: 'Audio',
        image: 'test.jpg'
    };

    it('renders product details correctly', () => {
        render(<ProductCard product={mockProduct} />);

        expect(screen.getByText(/Test Headphones/i)).toBeInTheDocument();
        expect(screen.getByText(/\$99.99/i)).toBeInTheDocument();
        expect(screen.getByText(/Audio/i)).toBeInTheDocument();

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'test.jpg');
        expect(img).toHaveAttribute('alt', 'Test Headphones');
    });
});
