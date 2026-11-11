import { defineConfig, devices } from '@playwright/test';
import { ENV } from './src/config/env.config.js';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!ENV.CI,
  retries: ENV.CI ? 2 : 0,
  workers: ENV.CI ? 2 : undefined,
  reporter: ENV.CI
    ? [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['blob', { outputDir: 'blob-report' }]
      ]
    : [
        ['list'],
        ['html', { open: 'on-failure' }]
      ],
  use: {
    baseURL: ENV.BASE_URL,
    actionTimeout: 10000,
    navigationTimeout: 15000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test',
  },
  expect: {
    timeout: 5000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'e2e-desktop',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: [/\.setup\.ts/, /tests\/api\/.*/, /tests\/unit\/.*/],
    },
    {
      name: 'api',
      use: {
        baseURL: ENV.API_BASE_URL,
      },
      testMatch: /tests\/api\/.*\.spec\.ts/,
    },
  ],
});
