"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testFixtures_1 = require("../fixtures/testFixtures");
const testData_1 = require("../utils/testData");
testFixtures_1.test.describe('Login Tests', () => {
    (0, testFixtures_1.test)('User should login successfully', async ({ page, loginPage }) => {
        await page.goto('/');
        await loginPage.login(testData_1.testData.login.username, testData_1.testData.login.password);
        await (0, testFixtures_1.expect)(page).toHaveURL(/inventory/);
        await (0, testFixtures_1.expect)(page.locator('.title')).toHaveText('Products');
    });
});
