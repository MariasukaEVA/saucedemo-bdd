import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../../fixtures/world';
import { CartPage } from '../../pages/cart.page';

Then('the cart should contain {int} item', async function (this: PlaywrightWorld, count: number) {
  const cartPage = new CartPage(this.page);
  const actual = await cartPage.getCartItemCount();
  expect(actual).toBe(count);
});

Then('the cart should be empty', async function (this: PlaywrightWorld) {
  const cartPage = new CartPage(this.page);
  const actual = await cartPage.getCartItemCount();
  expect(actual).toBe(0);
});

When('I remove {string} from the cart page', async function (this: PlaywrightWorld, itemName: string) {
  const cartPage = new CartPage(this.page);
  await cartPage.removeItem(itemName);
});

When('I click continue shopping', async function (this: PlaywrightWorld) {
  const cartPage = new CartPage(this.page);
  await cartPage.continueShopping();
});
