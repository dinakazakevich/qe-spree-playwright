import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a page title to be "Shop".
  await expect(page).toHaveTitle('Shop');
});
