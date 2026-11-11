import { Page, Locator, expect } from '@playwright/test';

export class NavbarComponent {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = this.page.locator('.shopping_cart_link');
    this.cartBadge = this.page.locator('.shopping_cart_badge');
    this.menuButton = this.page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = this.page.getByRole('link', { name: 'Logout' });
    this.resetAppStateLink = this.page.getByRole('link', { name: 'Reset App State' });
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.innerText();
      return parseInt(text.trim(), 10);
    }
    return 0;
  }

  async expectCartCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).toBeHidden();
    } else {
      await expect(this.cartBadge).toHaveText(expected.toString());
    }
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
