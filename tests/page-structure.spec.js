const { test, expect } = require('@playwright/test');

test.describe('page structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Corey Duffy/);
  });

  test('all sections exist', async ({ page }) => {
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#experience')).toBeVisible();
    await expect(page.locator('#skills')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
  });

  test('nav elements exist', async ({ page }) => {
    await expect(page.locator('.nav')).toBeVisible();
    await expect(page.locator('.nav-logo')).toBeVisible();
    await expect(page.locator('.nav-toggle')).toBeAttached();
    await expect(page.locator('.nav-menu')).toBeAttached();
  });

  test('hero section has key elements', async ({ page }) => {
    await expect(page.locator('.hero h1')).toContainText('Corey Duffy');
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.hero-cta')).toBeVisible();
  });

  test('external links have correct attributes', async ({ page }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('experience timeline has entries', async ({ page }) => {
    const timelineItems = page.locator('.timeline-item');
    const count = await timelineItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('skills section has categories', async ({ page }) => {
    const skillCategories = page.locator('.skill-category');
    const count = await skillCategories.count();
    expect(count).toBeGreaterThan(0);
  });

  test('contact section has links', async ({ page }) => {
    const contactLinks = page.locator('.contact-links a');
    const count = await contactLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('responsive design', () => {
  test('mobile: hamburger visible, nav menu hidden by default', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const navToggle = page.locator('.nav-toggle');
    await expect(navToggle).toBeVisible();
  });

  test('tablet: layout adapts correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('.nav')).toBeVisible();
  });

  test('desktop: full nav visible', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await expect(page.locator('.nav-menu')).toBeVisible();
  });
});

test.describe('accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('nav toggle has aria-label', async ({ page }) => {
    await expect(page.locator('.nav-toggle')).toHaveAttribute('aria-label');
  });

  test('images have alt text', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt');
    }
  });

  test('page has proper heading hierarchy', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    const h2Count = await page.locator('h2').count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test('meta description exists', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content');
  });
});
