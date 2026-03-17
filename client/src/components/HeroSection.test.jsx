import { render, screen } from '../__test__/test-utils';
import { describe, it, expect } from 'vitest';
import HeroSection from './HeroSection';

describe('HeroSection Component', () => {
    it('renders heading and text', () => {
        render(<HeroSection />);
        expect(screen.getByText(/Unleash Your Style/i)).toBeInTheDocument();
        expect(screen.getByText(/Discover the latest trends/i)).toBeInTheDocument();
    });
});
