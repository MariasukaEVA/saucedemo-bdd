import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../../fixtures/world';
import { InventoryPage } from '../../pages/inventory.page';

Then('I should see {int} products on the inventory page', async function (this: PlaywrightWorld, count: number) {
  const inventoryPage = new InventoryPage(this.page);
  const actual = await inventoryPage.getItemCount();
  expect(actual).toBe(count);
});

When('I sort products by {string}', async function (this: PlaywrightWorld, sortOption: string) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.sortBy(sortOption);
});

Then('the products should be sorted by price ascending', async function (this: PlaywrightWorld) {
  const inventoryPage = new InventoryPage(this.page);
  const prices = await inventoryPage.getItemPrices();
  const nums = prices.map(p => parseFloat(p.replace('$', '')));
  const sorted = [...nums].sort((a, b) => a - b);
  expect(nums).toEqual(sorted);
});

Then('the products should be sorted by name descending', async function (this: PlaywrightWorld) {
  const inventoryPage = new InventoryPage(this.page);
  const names = await inventoryPage.getItemNames();
  const sorted = [...names].sort((a, b) => b.localeCompare(a));
  expect(names).toEqual(sorted);
});

Then('the cart badge should show {int}', async function (this: PlaywrightWorld, count: number) {
  const inventoryPage = new InventoryPage(this.page);
  const actual = await inventoryPage.getCartBadgeCount();
  expect(actual).toBe(count);
});

Then('the cart badge should not be visible', async function (this: PlaywrightWorld) {
  const inventoryPage = new InventoryPage(this.page);
  const visible = await inventoryPage.isVisible(inventoryPage.cartBadge);
  expect(visible).toBe(false);
});
