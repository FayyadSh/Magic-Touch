// Import custom Jest matchers from the '@testing-library/jest-dom' package.
// These provide additional assertions for testing DOM elements, such as `.toBeInTheDocument()`.
import '@testing-library/jest-dom';
// Import the MSW (Mock Service Worker) server setup to mock API requests during testing.
import { server } from './mocks/mswSetup';

// Import polyfills for TextEncoder and TextDecoder, which are not natively available in Node.js.
import { TextEncoder, TextDecoder } from '@sinonjs/text-encoding';

// // Assign the polyfilled TextEncoder and TextDecoder to the global object,
// // so they are available globally during tests.
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

beforeAll(() => {
    server.listen(); 
});

// Reset any request handlers after each test to ensure that tests are isolated
// and don't interfere with each other.
afterEach(() => server.resetHandlers());

// Shut down the mock server once all tests have finished running to clean up resources.
afterAll(() => server.close());
