import { test, expect } from '../fixtures/testFixtures';
import { testData } from '../utils/testData';
import { handleJiraFailure } from '../utils/jira.failure';

test.describe('Login Tests', () => {

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const errorMessage =
        testInfo.error?.message || 'Unknown test failure';

      await handleJiraFailure(
        testInfo.title,
        errorMessage
      );
    }
  });

  test('User should login successfully', async ({ page, loginPage }) => {

    await page.goto('/');

    await loginPage.login(
      testData.login.username,
      testData.login.password
    );

    await expect(page.locator('.title')).toHaveText('Products');

  });

});