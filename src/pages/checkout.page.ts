import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class CheckoutPage extends BasePage {
  // Cart View
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  // Step One: Customer Info
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step Two: Overview & Summary
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;
  readonly finishButton: Locator;

  // Step Three: Complete
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.cartItems = this.page.locator('.cart_item');

    this.firstNameInput = this.page.locator('[data-test="firstName"]');
    this.lastNameInput = this.page.locator('[data-test="lastName"]');
    this.postalCodeInput = this.page.locator('[data-test="postalCode"]');
    this.continueButton = this.page.locator('[data-test="continue"]');
    this.errorMessage = this.page.locator('[data-test="error"]');

    this.summarySubtotal = this.page.locator('.summary_subtotal_label');
    this.summaryTax = this.page.locator('.summary_tax_label');
    this.summaryTotal = this.page.locator('.summary_total_label');
    this.finishButton = this.page.locator('[data-test="finish"]');

    this.completeHeader = this.page.locator('.complete-header');
    this.backHomeButton = this.page.locator('[data-test="back-to-products"]');
  }

  async proceedToCheckoutFromCart(): Promise<void> {
    await this.checkoutButton.click();
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillCustomerInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await expect(this.finishButton).toBeVisible();
    await this.finishButton.click();
  }

  async expectOrderCompleted(): Promise<void> {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toHaveText(/thank you for your order/i);
  }

  async expectErrorMessage(expected: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expected);
  }
}
