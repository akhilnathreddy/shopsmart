# ShopSmart Client — Testing Guide

## Tech Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Test runner | [Vitest](https://vitest.dev/) | Fast, Vite-native test runner |
| DOM testing | [@testing-library/react](https://testing-library.com/react) | Component rendering & assertions |
| DOM matchers | [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) | Custom DOM matchers (`.toBeInTheDocument()`, etc.) |
| API mocking | [MSW v2](https://mswjs.io/) | Intercepts `fetch` requests at the network level |
| E2E testing | [Playwright](https://playwright.dev/) | Browser-based end-to-end tests |
| DOM environment | [jsdom](https://github.com/jsdom/jsdom) | Simulated browser DOM for Vitest |

---

## Project Structure

```
client/
├── src/
│   ├── __mocks__/
│   │   ├── handlers.js      ← MSW request handlers (mock API responses)
│   │   └── server.js         ← MSW server instance for Node/Vitest
│   ├── __test__/
│   │   ├── test-utils.jsx    ← Custom render wrapper with providers
│   │   └── App.integration.test.jsx  ← Integration tests
│   ├── App.test.jsx           ← Unit tests
│   └── setupTests.js         ← Global test setup (jest-dom + MSW lifecycle)
├── e2e/
│   └── home.spec.js          ← Playwright E2E tests
└── playwright.config.js      ← Playwright configuration
```

---

## Running Tests Locally

### Unit Tests
```bash
npm run test:unit
```
Runs all `*.test.jsx` files **outside** of `src/__test__/` (i.e., co-located unit tests like `App.test.jsx`).

### Integration Tests
```bash
npm run test:integration
```
Runs all test files in `src/__test__/` directory.

### All Vitest Tests (unit + integration)
```bash
npm test
```

### E2E Tests (Playwright)
```bash
# First time: install browser binaries
npx playwright install --with-deps chromium

# Run E2E tests (auto-starts Vite dev server)
npm run test:e2e
```

### Coverage Report
```bash
npm run test:coverage
```

---

## How the Mock Layer Works

### MSW (Mock Service Worker) — for Unit & Integration Tests

MSW intercepts outgoing `fetch` requests **at the network level**, so your application code doesn't know it's being mocked. No need to mock `global.fetch` manually.

**Lifecycle** (configured in `setupTests.js`):
1. `beforeAll` → `server.listen()` — starts intercepting requests
2. `afterEach` → `server.resetHandlers()` — clears per-test overrides
3. `afterAll` → `server.close()` — stops intercepting

### Adding a New Mock Handler

1. **Open** `src/__mocks__/handlers.js`
2. **Add** a new handler using `http.get()`, `http.post()`, etc.:

```js
import { http, HttpResponse } from 'msw';

// In the handlers array:
http.get('/api/products', () => {
    return HttpResponse.json([
        { id: 1, name: 'Widget', price: 9.99 },
    ]);
}),
```

3. The handler is automatically active in **all tests** via `setupTests.js`.

### Overriding for a Specific Test

Use `server.use()` inside a test to temporarily override a handler:

```js
import { http, HttpResponse } from 'msw';
import { server } from '../__mocks__/server';

it('handles empty product list', async () => {
    server.use(
        http.get('/api/products', () => {
            return HttpResponse.json([]);
        })
    );
    // ... test code
});
// Handler automatically resets after this test via afterEach
```

---

## How to Write New Tests

### Unit Test (co-located, `src/ComponentName.test.jsx`)

```jsx
import { render, screen } from './__test__/test-utils';
import { describe, it, expect } from 'vitest';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
    it('renders correctly', () => {
        render(<MyComponent />);
        expect(screen.getByText(/hello/i)).toBeInTheDocument();
    });
});
```

### Integration Test (`src/__test__/Feature.integration.test.jsx`)

```jsx
import { render, screen, waitFor } from './test-utils';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('Feature flow', () => {
    it('loads data and displays it', async () => {
        render(<App />);
        await waitFor(() => {
            expect(screen.getByText(/expected data/i)).toBeInTheDocument();
        });
    });
});
```

### E2E Test (`e2e/feature.spec.js`)

```js
import { test, expect } from '@playwright/test';

test('user can complete checkout', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Add to Cart');
    await expect(page.locator('.cart-count')).toContainText('1');
});
```

---

## CI Pipeline Overview

The CI runs on every **push** and **pull request** to `main`. See `.github/workflows/ci.yml`.

| Job | What it does | Depends on |
|-----|-------------|------------|
| **client-unit** | Lint + unit tests | — |
| **client-integration** | Integration tests | — |
| **client-e2e** | Install Playwright → run E2E → upload report artifact | — |
| **client-build** | Production build verification | `client-unit` + `client-integration` |
| **server-ci** | Server tests | — |

### CI Job Details

- **client-unit**: Runs `npm run lint` followed by `npm run test:unit`. Catches syntax errors, linting violations, and component-level bugs.
- **client-integration**: Runs `npm run test:integration`. Verifies API interaction flows using MSW.
- **client-e2e**: Installs Chromium, runs Playwright tests against the Vite dev server. On failure, uploads the HTML report as a GitHub artifact (retained 14 days).
- **client-build**: Only runs after unit + integration tests pass. Ensures the production bundle compiles without errors.
