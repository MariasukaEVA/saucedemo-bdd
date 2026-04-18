import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { EnvConfig } from '../types';
import { envConfig } from '../config/env.config';

export interface PlaywrightWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  config: EnvConfig;
}

export class PlaywrightWorldImpl extends World implements PlaywrightWorld {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  config: EnvConfig;

  constructor(options: IWorldOptions) {
    super(options);
    this.config = envConfig;
  }
}

setWorldConstructor(PlaywrightWorldImpl);
