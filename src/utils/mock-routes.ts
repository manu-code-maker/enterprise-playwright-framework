import { Page, Route } from '@playwright/test';

export class MockRoutes {
  /**
   * Intercepts product/inventory network calls and injects a 500 Internal Server Error
   */
  static async simulateServerError(page: Page, urlPattern: string | RegExp = /.*\/api\/.*|.*\/products.*/): Promise<void> {
    await page.route(urlPattern, async (route: Route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error', message: 'Simulated downstream failure' }),
      });
    });
  }

  /**
   * Intercepts network calls to simulate slow network / throttling
   */
  static async simulateLatency(page: Page, delayMs = 3000, urlPattern: string | RegExp = /.*\/products.*/): Promise<void> {
    await page.route(urlPattern, async (route: Route) => {
      await new Promise(resolve => setTimeout(resolve, delayMs));
      await route.continue();
    });
  }

  /**
   * Injects an empty state payload
   */
  static async simulateEmptyInventory(page: Page, urlPattern: string | RegExp = /.*\/products.*/): Promise<void> {
    await page.route(urlPattern, async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ products: [], total: 0, skip: 0, limit: 10 }),
      });
    });
  }
}
