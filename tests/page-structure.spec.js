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
    await expect(page.locator('.nav-name')).toContainText('Corey Duffy');
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

  test('skills section has categories as text lists', async ({ page }) => {
    const skillCategories = page.locator('.skill-category');
    const count = await skillCategories.count();
    expect(count).toBeGreaterThan(0);

    await expect(page.locator('.skill-pills')).toHaveCount(count);
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

  test('skip link is first focusable element and targets main content', async ({ page }) => {
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute('href', '#content');
    await expect(page.locator('main#content')).toBeAttached();
  });

  test('images declare width and height', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('width');
      await expect(images.nth(i)).toHaveAttribute('height');
    }
  });
});

test.describe('seo and social metadata', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('head contains Open Graph and Twitter card tags', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Corey Duffy/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https:\/\/coreyduffy\.com\//);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://coreyduffy.com/');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /^https:\/\/coreyduffy\.com\//);
  });

  test('head contains canonical, favicon, and JSON-LD person schema', async ({ page }) => {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://coreyduffy.com/');
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href');

    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const person = JSON.parse(jsonLd);
    expect(person['@type']).toBe('Person');
    expect(person.name).toBe('Corey Duffy');
    expect(person.sameAs.length).toBeGreaterThan(0);
  });
});
