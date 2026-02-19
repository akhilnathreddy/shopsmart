import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create and export the MSW server instance for Node (Vitest) tests
export const server = setupServer(...handlers);
