import '@testing-library/jest-dom';
import { server } from './__mocks__/server';

// Start MSW server before all tests — intercepts all outgoing requests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers added during individual tests
afterEach(() => server.resetHandlers());

// Clean up after all tests are done
afterAll(() => server.close());
