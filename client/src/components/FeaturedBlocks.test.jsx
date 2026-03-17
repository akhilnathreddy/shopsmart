import { render, screen } from '../__test__/test-utils';
import { describe, it, expect } from 'vitest';
import FeaturedBlocks from './FeaturedBlocks';

describe('FeaturedBlocks Component', () => {
    it('renders heading', () => {
        render(<FeaturedBlocks />);
        expect(screen.getByText(/Models wearing/i)).toBeInTheDocument();
    });
});
