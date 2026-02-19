import { render } from '@testing-library/react';

/**
 * Custom render wrapper.
 * Wraps components with any providers (Router, Context, Theme, etc.)
 * needed across the app. Add providers here as the app grows.
 */
function AllProviders({ children }) {
    return <>{children}</>;
}

/**
 * Custom render that wraps the component in AllProviders.
 * Use this instead of importing `render` from @testing-library/react directly.
 */
const customRender = (ui, options) =>
    render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override the default render with our wrapped version
export { customRender as render };
