import { defineConfig, devices } from '@playwright/test';
import { environment } from './config/envirment';

declare const process: {
  env: {
    CI?: string;
  };
};

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  // HTML report
  reporter: [['html', { open: 'never' }]],

  use: {
    baseURL: environment.baseURL,

    // Screenshot only when test fails
    screenshot: 'only-on-failure',

    // Keep trace for failed tests
    trace: 'retain-on-failure',
  },

  projects: [

    // ==========================================
    // CHROME AUTH SETUP
    // ==========================================
    {
      name: 'chromium-setup',

      testMatch: /auth\.chrome\.setup\.ts/,

      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // ==========================================
    // CHROME TESTS
    // ==========================================
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/chrome-user.json',
      },

      dependencies: ['chromium-setup'],
    },

    // ==========================================
    // FIREFOX AUTH SETUP
    // ==========================================
    {
      name: 'firefox-setup',

      testMatch: /auth\.firefox\.setup\.ts/,

      use: {
        ...devices['Desktop Firefox'],
      },
    },

    // ==========================================
    // FIREFOX TESTS
    // ==========================================
    {
      name: 'firefox',

      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/firefox-user.json',
      },

      dependencies: ['firefox-setup'],
    },
  ],
});