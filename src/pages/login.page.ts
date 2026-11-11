import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.locator('[data-test="username"]');
    this.passwordInput = this.page.locator('[data-test="password"]');
    this.loginButton = this.page.locator('[data-test="login-button"]');
    this.errorMessage = this.page.locator('[data-test="error"]');
  }

  async open(): Promise<void> {
    await this.navigateTo('/');
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectErrorMessage(expectedText: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }
}
