// Shared TypeScript interfaces for the saucedemo-bdd framework

export interface TestUser {
  username: string;
  password: string;
  role: UserRole;
  env: Environment;
}

export type UserRole =
  | 'standard'
  | 'locked'
  | 'problem'
  | 'performance'
  | 'error'
  | 'visual';

export type Environment = 'uat' | 'dev' | 'sit' | 'prod';

export type Locale = 'en' | 'fr';

export type ViewportType = 'desktop' | 'mobile';

export interface EnvConfig {
  env: Environment;
  baseUrl: string;
  locale: Locale;
  viewport: ViewportType;
  headless: boolean;
  slowMo: number;
}

export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface ProductItem {
  name: string;
  price: number;
  description?: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}
