import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navigates to a specific path relative to baseURL
   */
  async navigateTo(path = ''): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Returns current URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Waits for a locator with web-first assertion
   */
  async waitForVisible(locator: Locator, timeout = 5000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Captures a targeted element screenshot
   */
  async captureElementScreenshot(locator: Locator, filename: string): Promise<Buffer> {
    return await locator.screenshot({ path: `test-results/screenshots/${filename}.png` });
  }
}
