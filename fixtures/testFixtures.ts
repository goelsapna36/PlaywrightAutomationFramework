import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { handleJiraFailure } from '../utils/jira.failure';
import { sendSlackMessage } from '../utils/slack.client';
import { testData } from '../utils/testData';
import { healFailure } from '../utils/healer';

type TestFixtures = {
    loginPage: LoginPage;
    loggedInPage: void;
};

export const test = base.extend<TestFixtures>({

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);

        await use(loginPage);
    },

    loggedInPage: async ({ page, loginPage }, use) => {

        await page.goto('/');

        // If storageState is already authenticated,
        // Playwright will open the inventory page directly.
        const currentUrl = page.url();

        if (!currentUrl.includes('/inventory.html')) {

            // No authenticated session → perform normal login
            await loginPage.login(
                testData.login.username,
                testData.login.password
            );

            await page.waitForURL(
                '**/inventory.html'
            );
        }

        await use();
    },
});

test.afterEach(async ({}, testInfo) => {

    if (testInfo.status !== testInfo.expectedStatus) {

        const errorMessage =
            testInfo.error?.message || 'Unknown test failure';

        // Existing Jira + Failure Analyzer
        await handleJiraFailure(
            testInfo.title,
            errorMessage
        );

        // Automation Healer only for Nightly/Scheduled run
        if (process.env.HEALER_ENABLED === 'true') {

            await healFailure(
                testInfo.title,
                errorMessage,
                testInfo.file
            );
        }

    } else {

        await sendSlackMessage(
            `✅ Playwright test passed: ${testInfo.title}`
        );
    }
});

// Export Playwright expect for test files
export { expect } from '@playwright/test';