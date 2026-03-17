import { render, screen } from '../__test__/test-utils';
import { describe, it, expect } from 'vitest';
import Navbar from './Navbar';

describe('Navbar Component', () => {
    it('renders logo', () => {
        render(<Navbar />);
        expect(screen.getByText(/SHOPSMART/i)).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(<Navbar />);
        expect(screen.getByText('New Arrivals')).toBeInTheDocument();
        expect(screen.getByText('Sales')).toBeInTheDocument();
        expect(screen.getByText('Women')).toBeInTheDocument();
        expect(screen.getByText('Men')).toBeInTheDocument();
    });

    it('renders search input with placeholder', () => {
        render(<Navbar />);
        expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();
    });
});
