import * as dotenv from 'dotenv';
import * as path from 'path';
import { EnvConfig, Environment, Locale, ViewportType } from '../types';

function loadEnvConfig(): EnvConfig {
  const env = (process.env.ENV || 'uat') as Environment;

  // Load environment-specific .env file
  const envFilePath = path.resolve(__dirname, `environments/${env}.env`);
  dotenv.config({ path: envFilePath });

  // Load local .env override (if exists)
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });

  const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';
  const locale = (process.env.LOCALE || 'en') as Locale;
  const viewport = (process.env.VIEWPORT || 'desktop') as ViewportType;
  const headless = process.env.HEADLESS !== 'false';
  const slowMo = parseInt(process.env.SLOW_MO || '0', 10);

  return { env, baseUrl, locale, viewport, headless, slowMo };
}

export const envConfig = loadEnvConfig();
