import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page.js';
import { InventoryPage } from '../pages/inventory.page.js';
import { CheckoutPage } from '../pages/checkout.page.js';
import { ApiClient } from '../api/clients/api.client.js';

export interface FrameworkFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  checkoutPage: CheckoutPage;
  apiClient: ApiClient;
}

export const test = baseTest.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  apiClient: async ({ request }, use) => {
    const apiClient = new ApiClient(request);
    await use(apiClient);
  },
});

export { expect };
