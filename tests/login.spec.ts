import { test, expect } from '../fixtures/testFixtures';
import { testData } from '../utils/testData';

test.describe('Login Tests', () => {

  test('User should login successfully', async ({ page, loginPage }) => {

    await page.goto('/');

    await loginPage.login(
      testData.login.username,
      testData.login.password
    );

    await expect(page).toHaveURL(/inventory/);

    await expect(
      page.locator('.title')
    ).toHaveText('Products');

  });

});