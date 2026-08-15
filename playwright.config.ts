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
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});