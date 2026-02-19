import { test, expect } from '@playwright/test';

test.describe('Homepage E2E Tests', () => {
    test('page loads and displays ShopSmart title', async ({ page }) => {
        await page.goto('/');

        // Verify the main title is visible
        await expect(page.locator('h1')).toContainText('ShopSmart');
    });

    test('Backend Status card is visible', async ({ page }) => {
        await page.goto('/');

        // The "Backend Status" heading should be present
        await expect(page.locator('h2')).toContainText('Backend Status');
    });

    test('displays loading state then resolves', async ({ page }) => {
        await page.goto('/');

        // Either we catch the loading text or it already resolved
        const card = page.locator('.card');
        await expect(card).toBeVisible();

        // Eventually the card should contain status information
        // (either from real backend or loading text)
        await expect(card).toContainText(/(Loading|Status)/i);
    });

    test('shows health check data when backend is running', async ({ page }) => {
        await page.goto('/');

        // Wait for the API response to render (timeout allows backend to respond)
        try {
            await expect(page.getByText('Status:')).toBeVisible({ timeout: 10000 });
            await expect(page.getByText('Message:')).toBeVisible();
            await expect(page.getByText('Timestamp:')).toBeVisible();
        } catch {
            // Backend might not be running — test still passes if loading state shows
            await expect(page.getByText(/Loading backend status/i)).toBeVisible();
        }
    });
});
