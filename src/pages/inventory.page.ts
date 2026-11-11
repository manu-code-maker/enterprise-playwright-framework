import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page.js';
import { NavbarComponent } from '../components/navbar.component.js';

export class InventoryPage extends BasePage {
  readonly navbar: NavbarComponent;
  readonly inventoryItems: Locator;
  readonly sortSelect: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.navbar = new NavbarComponent(page);
    this.inventoryItems = this.page.locator('.inventory_item');
    this.sortSelect = this.page.locator('[data-test="product-sort-container"]');
    this.itemNames = this.page.locator('.inventory_item_name');
    this.itemPrices = this.page.locator('.inventory_item_price');
  }

  async open(): Promise<void> {
    await this.navigateTo('/inventory.html');
    await expect(this.sortSelect).toBeVisible();
  }

  async addItemToCartByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async addItemByIndex(index: number): Promise<void> {
    await this.inventoryItems.nth(index).getByRole('button', { name: /add to cart/i }).click();
  }

  async removeItemByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async sortBy(optionValue: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortSelect.selectOption(optionValue);
  }

  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async getItemPrices(): Promise<number[]> {
    const priceTexts = await this.itemPrices.allInnerTexts();
    return priceTexts.map(t => parseFloat(t.replace('$', '').trim()));
  }

  async expectInventoryLoaded(): Promise<void> {
    await expect(this.inventoryItems.first()).toBeVisible();
  }
}
