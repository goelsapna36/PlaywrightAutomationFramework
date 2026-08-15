import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { handleJiraFailure } from '../utils/jira.failure';
import { sendSlackMessage } from '../utils/slack.client';

type TestFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await use(loginPage);
  },
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const errorMessage =
      testInfo.error?.message || 'Unknown test failure';

    await handleJiraFailure(
      testInfo.title,
      errorMessage
    );
  } else {
    await sendSlackMessage(
      `✅ Playwright test passed: ${testInfo.title}`
    );
  }
});

export { expect } from '@playwright/test';