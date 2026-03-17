import { render, screen } from '../__test__/test-utils';
import { describe, it, expect } from 'vitest';
import BrandBanner from './BrandBanner';

describe('BrandBanner Component', () => {
    it('renders brand names', () => {
        render(<BrandBanner />);
        expect(screen.getByText(/GRAPHIC STUDIO/i)).toBeInTheDocument();
        expect(screen.getByText(/S. SALVA/i)).toBeInTheDocument();
        expect(screen.getByText(/GOLDEN STUDIO/i)).toBeInTheDocument();
    });
});
