import {
  BeforeAll, AfterAll, Before, After, Status, ITestCaseHookParameter, setDefaultTimeout
} from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, devices } from 'playwright';
import { PlaywrightWorld } from './world';
import { takeScreenshot } from '../utils/screenshot';
import { logger } from '../utils/logger';

setDefaultTimeout(30_000);

let sharedBrowser: Browser;

BeforeAll(async function () {
  const config = (this as any).config || require('../config/env.config').envConfig;
  logger.info(`Starting browser — env=${config.env} headless=${config.headless}`);
  sharedBrowser = await chromium.launch({
    headless: config.headless,
    slowMo: config.slowMo,
  });
});

AfterAll(async function () {
  if (sharedBrowser) {
    await sharedBrowser.close();
    logger.info('Browser closed');
  }
});

Before(async function (this: PlaywrightWorld) {
  const isMobile = this.config.viewport === 'mobile';
  const deviceDescriptor = isMobile ? devices['Pixel 5'] : undefined;

  this.browser = sharedBrowser;
  this.context = await sharedBrowser.newContext({
    ...(deviceDescriptor || {}),
    ...(!isMobile && { viewport: { width: 1280, height: 720 } }),
    locale: this.config.locale,
  });
  this.page = await this.context.newPage();
  logger.info(`Scenario started — viewport=${this.config.viewport} locale=${this.config.locale}`);
});

After(async function (this: PlaywrightWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === Status.FAILED && this.page) {
    const scenarioName = scenario.pickle.name.replace(/\s+/g, '_').slice(0, 50);
    const screenshotPath = await takeScreenshot(this.page, `FAILED_${scenarioName}`);
    logger.error(`Scenario FAILED: ${scenario.pickle.name}`);
    logger.error(`Screenshot saved: ${screenshotPath}`);

    // Attach screenshot to Cucumber report
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }

  if (this.context) {
    await this.context.close();
  }
});
