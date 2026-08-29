import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'playwright/.auth/firefox-user.json';

setup('authenticate Firefox user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/');

  await loginPage.login(
    'problem_user',
    'secret_sauce'
  );

  await expect(
    page.locator('.title')
  ).toHaveText('Products');

  await page.context().storageState({
    path: authFile,
  });
});