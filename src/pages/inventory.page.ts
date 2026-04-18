import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  get inventoryContainer() { return '[data-test="inventory-container"]'; }
  get inventoryItems()     { return '[data-test="inventory-item"]'; }
  get itemNames()          { return '[data-test="inventory-item-name"]'; }
  get itemPrices()         { return '[data-test="inventory-item-price"]'; }
  get sortDropdown()       { return '[data-test="product-sort-container"]'; }
  get cartBadge()          { return '[data-test="shopping-cart-badge"]'; }
  get cartLink()           { return '[data-test="shopping-cart-link"]'; }
  get burgerMenu()         { return '[data-test="open-menu"]'; }

  addToCartButton(itemName: string): string {
    return `[data-test="add-to-cart-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
  }

  removeButton(itemName: string): string {
    return `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
  }

  async getItemCount(): Promise<number> {
    return this.count(this.inventoryItems);
  }

  async getItemNames(): Promise<string[]> {
    return this.getAllTexts(this.itemNames);
  }

  async getItemPrices(): Promise<string[]> {
    return this.getAllTexts(this.itemPrices);
  }

  async sortBy(option: string): Promise<void> {
    await this.selectOption(this.sortDropdown, option);
  }

  async addItemToCart(itemName: string): Promise<void> {
    await this.click(this.addToCartButton(itemName));
  }

  async removeItemFromCart(itemName: string): Promise<void> {
    await this.click(this.removeButton(itemName));
  }

  async getCartBadgeCount(): Promise<number> {
    const visible = await this.isVisible(this.cartBadge);
    if (!visible) return 0;
    const text = await this.getText(this.cartBadge);
    return parseInt(text, 10);
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartLink);
  }
}
