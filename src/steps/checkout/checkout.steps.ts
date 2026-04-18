import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../../fixtures/world';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

When('I proceed to checkout', async function (this: PlaywrightWorld) {
  const cartPage = new CartPage(this.page);
  await cartPage.proceedToCheckout();
  await expect(this.page).toHaveURL(/.*checkout-step-one/);
});

When('I fill in checkout info with first name {string} last name {string} postal code {string}',
  async function (this: PlaywrightWorld, firstName: string, lastName: string, postalCode: string) {
    const checkoutPage = new CheckoutPage(this.page);
    await checkoutPage.fillInfo(firstName, lastName, postalCode);
  }
);

When('I continue to the order overview', async function (this: PlaywrightWorld) {
  const checkoutPage = new CheckoutPage(this.page);
  await checkoutPage.continue();
});

Then('I should see the order summary', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/.*checkout-step-two/);
  const checkoutPage = new CheckoutPage(this.page);
  const count = await checkoutPage.count(checkoutPage.summaryItems);
  expect(count).toBeGreaterThan(0);
});

When('I finish the order', async function (this: PlaywrightWorld) {
  const checkoutPage = new CheckoutPage(this.page);
  await checkoutPage.finish();
});

Then('I should see the order confirmation', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/.*checkout-complete/);
  const checkoutPage = new CheckoutPage(this.page);
  const header = await checkoutPage.getCompleteHeader();
  expect(header).toContain('Thank you for your order');
});

Then('I should see the checkout error {string}', async function (this: PlaywrightWorld, expectedError: string) {
  const checkoutPage = new CheckoutPage(this.page);
  const actual = await checkoutPage.getErrorMessage();
  expect(actual).toContain(expectedError);
});
