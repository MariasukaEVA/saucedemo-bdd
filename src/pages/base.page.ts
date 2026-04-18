import { Page, Locator } from 'playwright';
import { logger } from '../utils/logger';

export class BasePage {
  constructor(protected page: Page) {}

  protected loc(selector: string): Locator {
    return this.page.locator(selector);
  }

  async click(selector: string): Promise<void> {
    logger.debug(`click: ${selector}`);
    await this.loc(selector).click();
  }

  async fill(selector: string, value: string): Promise<void> {
    logger.debug(`fill: ${selector} = "${value}"`);
    await this.loc(selector).fill(value);
  }

  async getText(selector: string): Promise<string> {
    const text = await this.loc(selector).innerText();
    logger.debug(`getText: ${selector} = "${text}"`);
    return text;
  }

  async isVisible(selector: string): Promise<boolean> {
    const visible = await this.loc(selector).isVisible();
    logger.debug(`isVisible: ${selector} = ${visible}`);
    return visible;
  }

  async waitForVisible(selector: string, timeout = 10000): Promise<void> {
    await this.loc(selector).waitFor({ state: 'visible', timeout });
  }

  async navigate(url: string): Promise<void> {
    logger.info(`navigate: ${url}`);
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getAllTexts(selector: string): Promise<string[]> {
    return this.loc(selector).allInnerTexts();
  }

  async count(selector: string): Promise<number> {
    return this.loc(selector).count();
  }

  async selectOption(selector: string, value: string): Promise<void> {
    logger.debug(`selectOption: ${selector} = "${value}"`);
    await this.loc(selector).selectOption(value);
  }
}
