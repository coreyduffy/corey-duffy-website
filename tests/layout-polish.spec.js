const { test, expect } = require('@playwright/test');

test.describe('experience highlights', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('most recent role is expanded by default, others collapsed', async ({ page }) => {
    const details = page.locator('.timeline-item details');
    await expect(details.first()).toHaveAttribute('open', '');

    const count = await details.count();
    for (let i = 1; i < count; i++) {
      await expect(details.nth(i)).not.toHaveAttribute('open');
    }
  });
});

test.describe('nav scrollspy', () => {
  test('nav link becomes active when its section is scrolled into view', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await page.evaluate(() => document.querySelector('#skills').scrollIntoView());
    await expect(page.locator('.nav-menu a[href="#skills"]')).toHaveClass(/active/);
    await expect(page.locator('.nav-menu a.active')).toHaveCount(1);
  });

  test('no nav link is active at the top of the page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await expect(page.locator('.nav-menu a.active')).toHaveCount(0);
  });
});

test.describe('about section layout', () => {
  test('heading sits beside content on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    const headingBox = await page.locator('.about h2').boundingBox();
    const contentBox = await page.locator('.about-content').boundingBox();

    expect(contentBox.x).toBeGreaterThanOrEqual(headingBox.x + headingBox.width);
    expect(Math.abs(contentBox.y - headingBox.y)).toBeLessThan(50);
  });

  test('heading stacks above content on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const headingBox = await page.locator('.about h2').boundingBox();
    const contentBox = await page.locator('.about-content').boundingBox();

    expect(contentBox.y).toBeGreaterThan(headingBox.y + headingBox.height - 1);
  });
});

test.describe('footer', () => {
  test('footer repeats contact links', async ({ page }) => {
    await page.goto('/');

    const footerLinks = page.locator('.footer-links a');
    await expect(footerLinks).toHaveCount(3);
    await expect(footerLinks.nth(1)).toHaveAttribute('href', /linkedin/);
    await expect(footerLinks.nth(2)).toHaveAttribute('href', /github/);
  });
});
