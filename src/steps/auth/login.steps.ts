import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../../fixtures/world';
import { LoginPage } from '../../pages/login.page';
import { getUser } from '../../config/accounts/users';

Given('I am on the login page', async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.open(this.config.baseUrl);
});

When('I log in as {string} user', async function (this: PlaywrightWorld, role: string) {
  const user = getUser(role as any, this.config.env);
  const loginPage = new LoginPage(this.page);
  await loginPage.login(user.username, user.password);
});

When('I enter username {string} and password {string}', async function (this: PlaywrightWorld, username: string, password: string) {
  const loginPage = new LoginPage(this.page);
  await loginPage.fill(loginPage.usernameInput, username);
  await loginPage.fill(loginPage.passwordInput, password);
});

When('I click the login button', async function (this: PlaywrightWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.click(loginPage.loginButton);
});

Then('I should see the inventory page', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/.*inventory/);
});

Then('I should see the error message {string}', async function (this: PlaywrightWorld, expectedMessage: string) {
  const loginPage = new LoginPage(this.page);
  const actualMessage = await loginPage.getErrorMessage();
  expect(actualMessage).toContain(expectedMessage);
});
