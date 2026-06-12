const { test, expect } = require('@playwright/test');

test.describe('theme toggle', () => {
  test('toggle button exists with aria-label', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();
    await expect(themeToggle).toHaveAttribute('aria-label');
  });
});

test.describe('first visit follows OS preference', () => {
  test.describe('light OS preference', () => {
    test.use({ colorScheme: 'light' });

    test('renders light theme', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    });
  });

  test.describe('dark OS preference', () => {
    test.use({ colorScheme: 'dark' });

    test('renders dark theme', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
  });

  test.describe('stored choice', () => {
    test.use({ colorScheme: 'light' });

    test('overrides OS preference', async ({ page }) => {
      await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    });
  });
});

test.describe('toggling', () => {
  test.use({ colorScheme: 'dark' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking toggles between dark and light', async ({ page }) => {
    const themeToggle = page.locator('.theme-toggle');
    const html = page.locator('html');

    await expect(html).toHaveAttribute('data-theme', 'dark');

    await themeToggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    await themeToggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });

  test('preference persists after reload', async ({ page }) => {
    await page.locator('.theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });

  test('no preference is written without using the toggle', async ({ page }) => {
    const stored = await page.evaluate(() => localStorage.getItem('theme'));
    expect(stored).toBeNull();
  });
});
