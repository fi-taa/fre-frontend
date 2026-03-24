import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

test('unauthenticated users are redirected from protected dashboard route', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  await page.goto('/dashboard/admins');
  await page.waitForURL('**/login');

  await expect(page).toHaveURL(/\/login$/);
});
