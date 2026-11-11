import { test, expect } from '../../src/fixtures/base.fixture.js';
import { ENV } from '../../src/config/env.config.js';

test.describe('Authentication Edge Cases', () => {
  // Reset storage state to test unauthenticated scenarios
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('should reject login for locked-out user with descriptive error @regression', async ({ loginPage }) => {
    await test.step('Attempt login with locked user', async () => {
      await loginPage.login(ENV.LOCKED_USER, ENV.STANDARD_PASSWORD);
    });

    await test.step('Verify error message banner', async () => {
      await loginPage.expectErrorMessage(/Sorry, this user has been locked out/i);
    });
  });

  test('should reject login with empty credentials @regression', async ({ loginPage }) => {
    await test.step('Click login button with empty fields', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Verify username required validation error', async () => {
      await loginPage.expectErrorMessage(/Username is required/i);
    });
  });

  test('should reject login with invalid password @regression', async ({ loginPage }) => {
    await test.step('Attempt login with wrong password', async () => {
      await loginPage.login(ENV.STANDARD_USER, 'WrongPassword123!');
    });

    await test.step('Verify username and password do not match error', async () => {
      await loginPage.expectErrorMessage(/Username and password do not match any user in this service/i);
    });
  });
});
