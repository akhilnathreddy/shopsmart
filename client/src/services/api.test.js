import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProducts } from './api';

const fetchMock = vi.fn();

describe('API Service - getProducts', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', fetchMock);
        fetchMock.mockClear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('fetches data successfully from the API', async () => {
        const mockData = [{ id: 1, title: 'Item 1' }];

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await getProducts();
        expect(result).toEqual(mockData);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('handles erroneously data from the API and returns an empty array', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
        });

        // Suppress console.error for this test to keep test output clean
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const result = await getProducts();
        expect(result).toEqual([]);
        expect(fetchMock).toHaveBeenCalledTimes(1);

        consoleSpy.mockRestore();
    });

    it('handles network failure and returns an empty array', async () => {
        fetchMock.mockRejectedValueOnce(new Error('Network failure'));

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const result = await getProducts();
        expect(result).toEqual([]);
        expect(fetchMock).toHaveBeenCalledTimes(1);

        consoleSpy.mockRestore();
    });
});
