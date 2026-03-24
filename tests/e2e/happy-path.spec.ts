import { test, expect } from '@playwright/test';

test('login to dashboard and logout flow works', async ({ page }) => {
  await page.route('**/api/v1/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'token-e2e',
        refresh_token: 'refresh-e2e',
        token_type: 'Bearer',
      }),
    });
  });

  await page.route('**/api/v1/users/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        email: 'admin@example.com',
        full_name: 'Admin',
        role: 'admin',
        is_active: true,
        department_ids: [1],
      }),
    });
  });

  await page.route('**/api/v1/students/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.route('**/api/v1/departments/', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.route('**/api/v1/users/admin/managers', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.goto('/login');

  await page.getByLabel('Username').fill('admin');
  await page.locator('#password').fill('secret123');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole('button', { name: /logout/i }).first().click();
  await page.waitForURL('**/login');
  await expect(page).toHaveURL(/\/login$/);
});
