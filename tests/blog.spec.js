const { test, expect } = require('@playwright/test');

test.describe('blog', () => {
  test('blog index returns 200 and lists sample post', async ({ page }) => {
    const response = await page.goto('/blog/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText('Writing');
    await expect(page.locator('.blog-post-link')).toContainText('Welcome to the blog');
  });

  test('post page renders title and body', async ({ page }) => {
    await page.goto('/blog/welcome/');
    await expect(page.locator('.blog-article-header h1')).toHaveText('Welcome to the blog');
    await expect(page.locator('.blog-prose')).toContainText('unified blog');
    await expect(page.locator('.blog-prose pre code')).toContainText('greet');
  });

  test('writing link on home navigates to blog', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav-menu a[href="/blog/"]').click();
    await expect(page).toHaveURL(/\/blog\/?$/);
    await expect(page.locator('h1')).toHaveText('Writing');
  });

  test('rss feed is available', async ({ request }) => {
    const response = await request.get('/blog/rss.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('<rss');
    expect(body).toContain('Welcome to the blog');
  });

  test('sitemap includes blog urls', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain('https://coreyduffy.com/blog/');
    expect(body).toContain('https://coreyduffy.com/blog/welcome/');
  });
});

test.describe('blog theme toggle', () => {
  test('theme toggle switches theme on blog index', async ({ page }) => {
    await page.goto('/blog/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    });
    await page.reload();

    const toggle = page.locator('.theme-toggle');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode');

    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode');

    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test.describe('blog mobile nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blog/');
  });

  test('mobile nav toggle works on blog', async ({ page }) => {
    const navToggle = page.locator('.nav-toggle');
    const navMenu = page.locator('.nav-menu');

    await navToggle.click();
    await expect(navMenu).toHaveClass(/active/);

    await navToggle.click();
    await expect(navMenu).not.toHaveClass(/active/);
  });
});
