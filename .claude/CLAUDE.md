# SauceDemo BDD — Claude Code Context

## Project Overview
Playwright + Cucumber BDD + TypeScript enterprise test automation POC targeting https://www.saucedemo.com.

## Stack
- **Test runner**: `@cucumber/cucumber@10` with `ts-node`
- **Browser automation**: `playwright` (not `@playwright/test`)
- **Language**: TypeScript (strict: false)
- **Reporting**: Cucumber HTML + JSON, Allure, multiple-cucumber-html-reporter
- **CI**: GitHub Actions (4-shard matrix)

## Project Structure
```
src/
  config/
    accounts/users.ts       # getUser(role, env) — never hardcode credentials
    environments/*.env      # per-env dotenv files
    env.config.ts           # loads EnvConfig from dotenv
    locales/en.json         # i18n strings
  features/
    auth/login.feature
    inventory/inventory.feature
    cart/cart.feature
    checkout/checkout.feature
  fixtures/
    world.ts                # PlaywrightWorld — this.page, this.config
    hooks.ts                # BeforeAll/AfterAll (browser), Before/After (context+page)
  pages/
    base.page.ts            # BasePage with click/fill/getText/isVisible/navigate
    login.page.ts
    inventory.page.ts
    cart.page.ts
    checkout.page.ts
  steps/
    auth/login.steps.ts
    inventory/inventory.steps.ts
    cart/cart.steps.ts
    checkout/checkout.steps.ts
    shared/common.steps.ts  # reusable Given steps (login, add to cart, etc.)
  types/index.ts            # TestUser, EnvConfig, UserRole, Environment interfaces
  utils/
    i18n.ts                 # t('key', locale)
    logger.ts               # colored console logger
    screenshot.ts           # takeScreenshot(page, name)
```

## Key Rules

### Locators
- **ONLY** use `data-test` attributes: `[data-test="element-name"]`
- Never use XPath, CSS class selectors, or text-based selectors
- SauceDemo uses slugified names for dynamic selectors (e.g. `add-to-cart-sauce-labs-backpack`)

### Shared State
- All step files use `this: PlaywrightWorld` typing
- Access browser via `this.page`, config via `this.config`
- Never create a new browser/page in steps — use the one from World

### Credentials
- Always use `getUser(role, env)` from `src/config/accounts/users.ts`
- Never hardcode usernames or passwords in steps or features

### Waits
- Never use `page.waitForTimeout()` — fix root causes instead
- Use `waitForVisible()`, `toHaveURL()`, or Playwright's auto-waiting

### Tags
- `@smoke` — critical path, fast (< 2 min)
- `@regression` — full coverage
- `@e2e` — cross-feature flows

## Page Object Pattern
```typescript
export class MyPage extends BasePage {
  get myButton() { return '[data-test="my-button"]'; }

  async doAction(): Promise<void> {
    await this.click(this.myButton);
  }
}
```

## Step Pattern
```typescript
When('I do something', async function (this: PlaywrightWorld) {
  const page = new MyPage(this.page);
  await page.doAction();
});
```

## Running Tests
```bash
npm run test:uat              # all tests against UAT
npm run test:smoke            # @smoke tag only
ENV=uat npx cucumber-js --config cucumber.config.js --tags @smoke
npx cucumber-js --config cucumber.config.js --dry-run  # verify step matching
```

## Do NOT
- Add `page.waitForTimeout()` calls
- Hardcode credentials
- Use XPath or class-based selectors
- Create new browser instances in steps
- Use `@playwright/test` fixtures — use Cucumber World instead
