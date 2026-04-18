import { Locale } from '../types';

// Locale JSON files
const locales: Record<Locale, any> = {
  en: require('../config/locales/en.json'),
  fr: require('../config/locales/fr.json'),
};

/**
 * Get a translated string by dot-notation key.
 * Example: t('login.loginButton', 'en') => 'Login'
 */
export function t(key: string, locale: Locale = 'en'): string {
  const parts = key.split('.');
  let value: any = locales[locale];

  for (const part of parts) {
    if (value === undefined || value === null) {
      throw new Error(`i18n key not found: "${key}" in locale "${locale}"`);
    }
    value = value[part];
  }

  if (typeof value !== 'string') {
    throw new Error(`i18n key "${key}" in locale "${locale}" is not a string`);
  }

  return value;
}
