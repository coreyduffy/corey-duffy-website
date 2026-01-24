const { test, expect } = require('@playwright/test');

test.describe('mobile nav toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('hamburger toggles active class on nav-toggle and nav-menu', async ({ page }) => {
    const navToggle = page.locator('.nav-toggle');
    const navMenu = page.locator('.nav-menu');

    await expect(navToggle).not.toHaveClass(/active/);
    await expect(navMenu).not.toHaveClass(/active/);

    await navToggle.click();

    await expect(navToggle).toHaveClass(/active/);
    await expect(navMenu).toHaveClass(/active/);

    await navToggle.click();

    await expect(navToggle).not.toHaveClass(/active/);
    await expect(navMenu).not.toHaveClass(/active/);
  });

  test('clicking nav link closes mobile menu', async ({ page }) => {
    const navToggle = page.locator('.nav-toggle');
    const navMenu = page.locator('.nav-menu');
    const aboutLink = page.locator('.nav-menu a[href="#about"]');

    await navToggle.click();
    await expect(navMenu).toHaveClass(/active/);

    await aboutLink.click();

    await expect(navToggle).not.toHaveClass(/active/);
    await expect(navMenu).not.toHaveClass(/active/);
  });

  test('each nav link closes menu when clicked', async ({ page }) => {
    const navToggle = page.locator('.nav-toggle');
    const navMenu = page.locator('.nav-menu');
    const links = ['#about', '#experience', '#skills', '#contact'];

    for (const href of links) {
      await navToggle.click();
      await expect(navMenu).toHaveClass(/active/);

      await page.locator(`.nav-menu a[href="${href}"]`).click();
      await expect(navMenu).not.toHaveClass(/active/);
    }
  });
});

test.describe('smooth scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('anchor link scrolls to target section', async ({ page }) => {
    const initialScrollY = await page.evaluate(() => window.scrollY);

    await page.locator('a[href="#about"]').first().click();

    await page.waitForFunction(() => window.scrollY > 0);
    const newScrollY = await page.evaluate(() => window.scrollY);

    expect(newScrollY).toBeGreaterThan(initialScrollY);
  });

  test('scroll accounts for fixed nav height', async ({ page }) => {
    await page.locator('a[href="#about"]').first().click();
    await page.waitForFunction(() => window.scrollY > 0);

    const aboutSection = page.locator('#about');
    const nav = page.locator('.nav');

    const aboutRect = await aboutSection.boundingBox();
    const navRect = await nav.boundingBox();

    expect(aboutRect.y).toBeGreaterThanOrEqual(navRect.height - 5);
  });

  test('logo link exists and is clickable', async ({ page }) => {
    const logo = page.locator('.nav-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '#');
  });

  test('all section anchor links work', async ({ page }) => {
    const sections = ['#about', '#experience', '#skills', '#contact'];

    for (const section of sections) {
      await page.goto('/');
      await page.locator(`a[href="${section}"]`).first().click();
      await page.waitForFunction(() => window.scrollY > 0);

      const sectionElement = page.locator(section);
      await expect(sectionElement).toBeVisible();
    }
  });
});

test.describe('desktop navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
  });

  test('nav menu visible on desktop', async ({ page }) => {
    const navMenu = page.locator('.nav-menu');
    await expect(navMenu).toBeVisible();
  });

  test('all nav links present', async ({ page }) => {
    await expect(page.locator('.nav-menu a[href="#about"]')).toBeVisible();
    await expect(page.locator('.nav-menu a[href="#experience"]')).toBeVisible();
    await expect(page.locator('.nav-menu a[href="#skills"]')).toBeVisible();
    await expect(page.locator('.nav-menu a[href="#contact"]')).toBeVisible();
  });
});
