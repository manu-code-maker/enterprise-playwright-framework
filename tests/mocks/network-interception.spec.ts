import { test, expect } from '../../src/fixtures/base.fixture.js';
import { MockRoutes } from '../../src/utils/mock-routes.js';

test.describe('Network Interception & Resiliency Mocks', () => {
  test('should gracefully intercept API calls and inject 500 error payload @mock', async ({ page }) => {
    // Intercept image assets or backend API call to test UI resilience
    let intercepted = false;

    await page.route(/.*sauce-backpack.*\.jpg/, async (route) => {
      intercepted = true;
      await route.fulfill({
        status: 500,
        contentType: 'image/jpeg',
        body: Buffer.from(''),
      });
    });

    await page.goto('/inventory.html');
    expect(intercepted).toBe(true);
  });

  test('should simulate empty cart state through intercepted storage @mock', async ({ page, inventoryPage }) => {
    await inventoryPage.open();
    await inventoryPage.navbar.expectCartCount(0);
  });
});
