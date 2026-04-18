import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // Locators using data-test attributes
  get usernameInput() { return '[data-test="username"]'; }
  get passwordInput() { return '[data-test="password"]'; }
  get loginButton()   { return '[data-test="login-button"]'; }
  get errorMessage()  { return '[data-test="error"]'; }

  async open(baseUrl: string): Promise<void> {
    await this.navigate(baseUrl);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }
}
