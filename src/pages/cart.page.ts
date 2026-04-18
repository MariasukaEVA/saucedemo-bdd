import { BasePage } from './base.page';

export class CartPage extends BasePage {
  get cartItems()         { return '[data-test="inventory-item"]'; }
  get itemNames()         { return '[data-test="inventory-item-name"]'; }
  get itemPrices()        { return '[data-test="inventory-item-price"]'; }
  get itemQuantities()    { return '[data-test="item-quantity"]'; }
  get checkoutButton()    { return '[data-test="checkout"]'; }
  get continueShoppingButton() { return '[data-test="continue-shopping"]'; }
  get cartBadge()         { return '[data-test="shopping-cart-badge"]'; }

  removeButton(itemName: string): string {
    return `[data-test="remove-${itemName.toLowerCase().replace(/\s+/g, '-')}"]`;
  }

  async getCartItemCount(): Promise<number> {
    return this.count(this.cartItems);
  }

  async getItemNames(): Promise<string[]> {
    return this.getAllTexts(this.itemNames);
  }

  async removeItem(itemName: string): Promise<void> {
    await this.click(this.removeButton(itemName));
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton);
  }
}
