// Vitest setup file
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server.js'; // Corrected path if server.js is in mocks

// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

console.log('Vitest setup file loaded and MSW server configured.');
