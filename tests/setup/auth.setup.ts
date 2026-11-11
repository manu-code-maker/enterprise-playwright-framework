import { test as setup, expect } from '@playwright/test';
import { ENV } from '../../src/config/env.config.js';
import fs from 'fs';
import path from 'path';

const authFile = '.auth/user.json';

setup('authenticate standard user', async ({ page }) => {
  // Ensure .auth directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  await page.goto('/');
  await page.locator('[data-test="username"]').fill(ENV.STANDARD_USER);
  await page.locator('[data-test="password"]').fill(ENV.STANDARD_PASSWORD);
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/.*inventory\.html/);

  await page.context().storageState({ path: authFile });
  console.log('✅ Standard user authentication state saved to', authFile);
});
