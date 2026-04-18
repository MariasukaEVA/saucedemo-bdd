import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../../fixtures/world';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { getUser } from '../../config/accounts/users';

Given('I am logged in as {string} user', async function (this: PlaywrightWorld, role: string) {
  const user = getUser(role as any, this.config.env);
  const loginPage = new LoginPage(this.page);
  await loginPage.open(this.config.baseUrl);
  await loginPage.login(user.username, user.password);
  await expect(this.page).toHaveURL(/.*inventory/);
});

Given('I have added {string} to the cart', async function (this: PlaywrightWorld, itemName: string) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.addItemToCart(itemName);
});

Given('I am on the cart page', async function (this: PlaywrightWorld) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.goToCart();
  await expect(this.page).toHaveURL(/.*cart/);
});

When('I add {string} to the cart', async function (this: PlaywrightWorld, itemName: string) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.addItemToCart(itemName);
});

When('I remove {string} from the cart', async function (this: PlaywrightWorld, itemName: string) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.removeItemFromCart(itemName);
});

When('I go to the cart', async function (this: PlaywrightWorld) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.goToCart();
});

Then('I should be on the inventory page', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/.*inventory/);
});
