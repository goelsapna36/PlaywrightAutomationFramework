# Playwright Automation Framework - Current Project Documentation

## Overview
This project is a Playwright + TypeScript automation framework built for UI validation against SauceDemo. It includes cross-browser execution, page object model structure, reusable fixtures, browser state authentication, Jira integration, Slack notifications, and a failure-healing mechanism.

This document reflects the actual implementation that was built in the project and is meant to serve as a working reference for future maintenance and onboarding.

---

## Project Goal
The framework is designed to:
- automate key user flows such as login, product listing, and cart validation
- run tests in multiple browsers with reusable auth state
- keep automation code clean and maintainable using Page Object Model
- notify the team when tests fail
- create Jira issues/comments automatically from failed test data
- support a lightweight repair workflow for common locator and UI changes

---

## Tech Stack
- Playwright Test
- TypeScript
- Node.js
- dotenv
- Axios
- Slack Bolt
- SauceDemo as the target app

---

## Current Folder Structure

```text
PlaywrightFreamwork/
├── config/
│   └── envirment.ts
├── fixtures/
│   └── testFixtures.ts
├── pages/
│   ├── CartPage.ts
│   ├── LoginPage.ts
│   └── ProductPage.ts
├── playwright/
│   ├── chrome-user.json
│   └── firefox-user.json
├── tests/
│   ├── auth.chrome.setup.ts
│   ├── auth.firefox.setup.ts
│   ├── cart.spec.ts
│   ├── login.spec.ts
│   ├── product.spec.ts
│   └── Api01/
│       └── 01_Post_API_Reguest_Static.spec.ts
├── utils/
│   ├── failure.analyzer.ts
│   ├── healer.ts
│   ├── jira.client.ts
│   ├── jira.failure.ts
│   ├── slack.bot.ts
│   ├── slack.client.ts
│   ├── slack.healer.ts
│   ├── testData.ts
│   └── test-data/
│       └── api_request/
│           └── POst_Api.json
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── PROJECT_SETUP_DOCUMENTATION.md
├── test-jira.ts
└── test-results/
```

---

## Core Config Settings

### Playwright config
The project uses `playwright.config.ts` to define the execution environment and browser setup.

Important configuration details:
- `testDir: './tests'`
- `fullyParallel: true`
- `reporter: [['html', { open: 'never' }]]`
- `baseURL: 'https://www.saucedemo.com'`
- failed tests keep screenshot and trace via:
  - `screenshot: 'only-on-failure'`
  - `trace: 'retain-on-failure'`

### Browser projects
The framework creates separate projects for Chrome and Firefox:
- `chromium-setup`
- `chromium`
- `firefox-setup`
- `firefox`

This enables the project to create and reuse storage state for authenticated sessions.

---

## Environment Configuration

The file `config/envirment.ts` contains the base URL for all tests:

```ts
export const environment = {
  baseURL: 'https://www.saucedemo.com',
};
```

This approach makes it easy to centralize environment changes without editing multiple files.

---

## Browser Authentication Flow

The project uses Playwright storage state to save and reuse login sessions.

### Setup files
- `tests/auth.chrome.setup.ts`
- `tests/auth.firefox.setup.ts`

These files:
1. open the SauceDemo login page
2. log in using valid credentials
3. verify the inventory page is loaded
4. save browser context state to JSON files in `playwright/.auth/`

### Usage in config
In `playwright.config.ts`, each browser project references a saved auth file:

```ts
storageState: 'playwright/.auth/chrome-user.json'
```

and

```ts
storageState: 'playwright/.auth/firefox-user.json'
```

This allows tests to start from an already-authenticated state and avoids repeating login logic inside every test.

---

## Page Object Model (POM)

The UI layer is separated into page classes so actions and selectors are centralized.

### LoginPage
`pages/LoginPage.ts` contains:
- username field locator
- password field locator
- login button locator
- reusable `login(username, password)` method

### ProductPage
`pages/ProductPage.ts` contains product listing actions and selectors:
- product name/description/price locators
- add-to-cart buttons
- sorting dropdown methods
- helper methods to read product details

### CartPage
`pages/CartPage.ts` contains cart-related actions:
- cart title validation
- validation of product details in cart
- checkout button actions
- remove button handling

This keeps tests readable and reduces duplication across scenarios.

---

## Custom Fixtures

The project uses `fixtures/testFixtures.ts` to create reusable test setup and teardown logic.

### What the fixture does
- creates a `loginPage` object for each test
- automatically opens the app
- checks whether a valid session already exists
- logs in only when needed
- runs post-test validation and notifications

### Post-test logic
After each test, the fixture checks whether the test failed or passed:
- failed test → Jira handling and optional healer flow
- passed test → Slack success message

This is the central place for test lifecycle behavior.

---

## Test Data Management

`utils/testData.ts` stores standard credentials used across the framework.

```ts
export const testData = {
  login: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
};
```

This keeps credentials in one place and makes future updates easier.

---

## Existing Tests

### Login test
`tests/login.spec.ts`
- verifies a valid login
- asserts that the inventory page loads
- uses `@regression` tag

### Product test
`tests/product.spec.ts`
- validates all product names, descriptions, and prices
- checks add-to-cart button count
- tests product sorting filters (`az`, `za`, `lohi`, `hilo`)
- uses `@regression` tag

### Cart test
`tests/cart.spec.ts`
- adds a product to cart
- validates cart details match the product listing
- removes the item and verifies the cart updates

These tests cover the main shopping flow for the SauceDemo application.

---

## Jira Integration

### Files involved
- `utils/jira.client.ts`
- `utils/jira.failure.ts`

### What it does
When a test fails:
- failure type is analyzed
- Jira is searched for an existing issue matching the summary
- if found, a comment is added
- if not found, a new Jira bug is created

### Jira request behavior
- project key: `KAN`
- issue type: `Bug`
- summary includes the test name scenario
- description includes the Playwright failure message

This helps keep test failures tracked in Jira without manual ticket creation.

---

## Slack Notifications

### Files involved
- `utils/slack.client.ts`
- `utils/slack.healer.ts`

### What it does
- sends pass/fail messages to a configured Slack webhook
- uses `SLACK_WEBHOOK_URL` for normal automation notifications
- uses `SLACK_HEALER_WEBHOOK_URL` for self-healing communications

### Important note
Slack notifications are conditional and will fail only if the environment variables are not configured.

---

## Failure Analyzer and Healer

### Files involved
- `utils/failure.analyzer.ts`
- `utils/healer.ts`
- `utils/slack.healer.ts`

The framework includes a basic failure classification layer that tries to identify the likely cause of a failed test.

### Failure categories
- locator/UI issue
- network/environment issue
- application/API issue
- assertion/test logic issue
- unknown failure

### Healer behavior
When `HEALER_ENABLED === 'true'` and a test fails, the framework can:
- detect a likely locator mismatch
- propose a replacement value
- send a Slack approval message
- apply the suggested fix after approval
- rerun the test automatically

This is a lightweight automation-assisted repair pattern to reduce repeated UI breakage caused by text or selector drift.

---

## Reporting and Artifacts

The Playwright config includes an HTML reporter and failed-test artifacts:
- HTML report generated from Playwright results
- screenshots on failure
- trace retained on failure

This helps in debugging without needing to rerun the test repeatedly.

---

## Execution Commands

From the project root:

```bash
npx playwright test
```

To run a specific file:

```bash
npx playwright test tests/login.spec.ts
```

To run the file with HTML report output:

```bash
npx playwright test --reporter=html
```

---

## Recommended Working Pattern

For future maintenance, keep the following pattern consistent:
1. Add or update selectors in the appropriate page object file.
2. Keep test logic in the spec files and not inline in page actions.
3. Store reusable values in `utils/testData.ts`.
4. Use fixtures for login and shared setup.
5. For new failures, check Jira/Slack integration first before changing test logic.
6. Keep browser auth setup files updated if login flow changes.

---

## Key Implementation Notes

- The project uses `storageState` heavily to optimize execution and avoid repeated login flows.
- Test logic is intentionally separated from page selectors and interactions.
- The project is set up to support both local execution and automation alerting.
- The failure-healing workflow is currently best suited to highly predictable UI issues such as locator text mismatches.
- `NODE_ENV`/env-based configuration should be expanded further if the framework is extended to other projects or environments.

---

## Future Improvements

This project can be improved further by adding:
- environment-based config for dev, QA, and prod
- CI pipeline via GitHub Actions
- hidden/secrets management through `.env.example`
- custom suite tags for smoke, regression, nightly, and critical paths
- more structured reporting with screenshots and historical test trends
- expanded API test integration alongside UI automation

---

## Summary
The framework currently includes a solid automation base for UI testing with:
- Playwright + TypeScript setup
- reusable page objects
- browser auth state management
- cross-browser execution
- test data centralization
- Jira bug integration
- Slack notifications
- failure classification and healing support

This is a practical and maintainable foundation for future automation work and should be treated as the working baseline for the project.

---

## Final Note for Future Team Members
When working on this project in the future, start by understanding the flow below:

```text
Test file → Fixture setup → Page Object Model → Browser execution → Result → Jira/Slack notification
```

If a failure occurs, check the failing locator, test data, auth state, and the integration files before making broad changes.

    ↓
Slack Notifications (Alert team)
    ↓
HTML Report Generation
    ↓
Artifacts Saved (Screenshots, videos, traces)
    ↓
PR Quality Gate
    ↓
Decision: Merge or Block
```

---

## Next Steps

1. **Monitor tests**: Check daily test results
2. **Fix failures**: Address any broken tests immediately
3. **Expand coverage**: Add more tests for new features
4. **Tune performance**: Optimize test execution time
5. **Team training**: Ensure everyone understands the framework

---

## Files Created/Modified Today

### New Files
- `pages/ProductPage.ts` - Product page object model
- `tests/product.spec.ts` - Product page tests
- `utils/failure.analyzer.ts` - Failure analysis utility
- `utils/healer.ts` - Test healing utility
- `utils/slack.client.ts` - Slack integration

### Updated Files
- `.github/workflows/playwright.yml` - CI/CD pipeline
- `playwright.config.ts` - Configuration
- `fixtures/testFixtures.ts` - Test fixtures
- `config/envirment.ts` - Environment settings
- Various test and utility files

---

## Conclusion

You've built a **production-grade test automation framework** that:
- ✅ Runs automatically
- ✅ Catches bugs early
- ✅ Notifies the team
- ✅ Prevents bad code from reaching production
- ✅ Saves time and money

This is a solid foundation for maintaining code quality and delivering reliable software! 🎉

