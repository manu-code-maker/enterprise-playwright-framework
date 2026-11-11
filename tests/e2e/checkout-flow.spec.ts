import { test, expect } from '../../src/fixtures/base.fixture.js';
import { TestDataFactory } from '../../src/utils/test-data.factory.js';

test.describe('E-Commerce Checkout Flow', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.open();
  });

  test('should complete end-to-end checkout successfully with dynamic customer data @smoke @regression', async ({
    inventoryPage,
    checkoutPage,
  }) => {
    const customer = TestDataFactory.createCustomer();

    await test.step('1. Verify inventory loaded and add items to cart', async () => {
      await inventoryPage.expectInventoryLoaded();
      await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
      await inventoryPage.addItemToCartByName('Sauce Labs Bike Light');
      await inventoryPage.navbar.expectCartCount(2);
    });

    await test.step('2. Navigate to cart and proceed to checkout', async () => {
      await inventoryPage.navbar.openCart();
      await checkoutPage.proceedToCheckoutFromCart();
    });

    await test.step('3. Fill customer shipping information', async () => {
      await checkoutPage.fillCustomerInformation(customer.firstName, customer.lastName, customer.postalCode);
    });

    await test.step('4. Verify order overview and finish order', async () => {
      await expect(checkoutPage.summarySubtotal).toBeVisible();
      await expect(checkoutPage.summaryTax).toBeVisible();
      await expect(checkoutPage.summaryTotal).toBeVisible();
      await checkoutPage.finishOrder();
    });

    await test.step('5. Assert order completion confirmation', async () => {
      await checkoutPage.expectOrderCompleted();
    });
  });

  test('should dynamically update cart badge when items are added and removed @regression', async ({
    inventoryPage,
  }) => {
    await test.step('Add first item and verify count = 1', async () => {
      await inventoryPage.addItemToCartByName('Sauce Labs Bolt T-Shirt');
      await inventoryPage.navbar.expectCartCount(1);
    });

    await test.step('Add second item and verify count = 2', async () => {
      await inventoryPage.addItemToCartByName('Sauce Labs Fleece Jacket');
      await inventoryPage.navbar.expectCartCount(2);
    });

    await test.step('Remove first item and verify count = 1', async () => {
      await inventoryPage.removeItemByName('Sauce Labs Bolt T-Shirt');
      await inventoryPage.navbar.expectCartCount(1);
    });
  });

  test('should validate sorting products by price low to high @regression', async ({
    inventoryPage,
  }) => {
    await test.step('Sort by low to high and assert ascending price sequence', async () => {
      await inventoryPage.sortBy('lohi');
      const prices = await inventoryPage.getItemPrices();
      expect(prices.length).toBeGreaterThan(0);
      
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).toEqual(sortedPrices);
    });
  });
});
