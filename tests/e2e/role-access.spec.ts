import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
});

async function setAuth(page: import('@playwright/test').Page, role: 'super_admin' | 'admin' | 'manager') {
  await page.addInitScript((roleValue) => {
    sessionStorage.setItem(
      'auth_token',
      JSON.stringify({
        access_token: 'token-e2e',
        token_type: 'Bearer',
      })
    );
    localStorage.setItem('refresh_token', 'refresh-e2e');
    localStorage.setItem('NEXT_LOCALE', 'en');

    (window as Window & { __role__?: string }).__role__ = roleValue;
  }, role);

  await page.route('**/api/v1/users/me', async (route) => {
    const roleValue = await page.evaluate(() => (window as Window & { __role__?: string }).__role__ || 'manager');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 100,
        email: `${roleValue}@example.com`,
        full_name: roleValue,
        role: roleValue,
        is_active: true,
        department_ids: [1],
      }),
    });
  });

  await page.route('**/api/v1/users/', async (route) => {
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
}

test('unauthenticated users are redirected from protected dashboard route', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  await page.goto('/dashboard/admins');
  await page.waitForURL('**/login');

  await expect(page).toHaveURL(/\/login$/);
});

test('superadmin can access admins dashboard page', async ({ page }) => {
  await setAuth(page, 'super_admin');
  await page.goto('/dashboard/admins');
  await expect(page).toHaveURL(/\/dashboard\/admins$/);
  await expect(page.getByRole('heading', { name: 'Admins' })).toBeVisible();
});

test('admin is redirected away from superadmin-only admins page', async ({ page }) => {
  await setAuth(page, 'admin');
  await page.goto('/dashboard/admins');
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('manager is redirected away from managers page', async ({ page }) => {
  await setAuth(page, 'manager');
  await page.goto('/dashboard/managers');
  await page.waitForURL('**/dashboard');
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('admin can access managers page', async ({ page }) => {
  await setAuth(page, 'admin');
  await page.goto('/dashboard/managers');
  await expect(page).toHaveURL(/\/dashboard\/managers$/);
  await expect(page.getByRole('heading', { name: 'Managers' })).toBeVisible();
});
