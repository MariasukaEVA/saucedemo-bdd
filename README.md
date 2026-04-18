# saucedemo-bdd

Playwright + Cucumber BDD + TypeScript enterprise test automation POC for [SauceDemo](https://www.saucedemo.com).

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| `@cucumber/cucumber` | ^10 | BDD test runner |
| `playwright` | ^1.44 | Browser automation |
| `typescript` | ^5 | Language |
| `ts-node` | ^10 | TypeScript execution |
| `allure-cucumberjs` | ^3 | Rich reporting |
| `multiple-cucumber-html-reporter` | ^3 | HTML reporting |

## Quick Start

```bash
npm install
npx playwright install chromium
npm run test:smoke          # @smoke scenarios against UAT
npm run test:uat            # full suite against UAT
npm run test:regression     # @regression scenarios
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run test:uat` | Full suite, UAT env |
| `npm run test:smoke` | @smoke tag only |
| `npm run test:regression` | @regression tag only |
| `npm run report:html` | Generate multi-cucumber HTML report |
| `npm run report:allure` | Generate & open Allure report |
| `npm run tsc:check` | TypeScript type check |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  config/
    accounts/users.ts       # User credentials by role + env
    environments/           # Per-env dotenv files (uat/dev/sit/prod)
    env.config.ts           # EnvConfig loader
  features/                 # Gherkin feature files
    auth/login.feature
    inventory/inventory.feature
    cart/cart.feature
    checkout/checkout.feature
  fixtures/
    world.ts                # PlaywrightWorld (this.page, this.config)
    hooks.ts                # Browser lifecycle + screenshot on fail
  pages/                    # Page Object Model
    base.page.ts
    login.page.ts
    inventory.page.ts
    cart.page.ts
    checkout.page.ts
  steps/                    # Cucumber step definitions
    auth/login.steps.ts
    inventory/inventory.steps.ts
    cart/cart.steps.ts
    checkout/checkout.steps.ts
    shared/common.steps.ts
  utils/
    logger.ts
    screenshot.ts
    i18n.ts
.github/workflows/
  ci.yml                    # 4-shard matrix + Allure + GitHub Pages
  scheduled-regression.yml  # Nightly regression
prompts/                    # AI prompt library
  generate/                 # Feature/step/page generation prompts
  review/                   # Test quality review prompts
  debug/                    # Failure triage prompts
  ci/                       # CI report analysis prompts
```

## Key Conventions

- **Locators**: `data-test` attributes only — no XPath, no CSS classes
- **Credentials**: always via `getUser(role, env)` — never hardcoded
- **Shared state**: Cucumber World (`this.page`, `this.config`)
- **Steps**: always typed `this: PlaywrightWorld`
- **Waits**: no `waitForTimeout()` — use Playwright auto-waiting

## Environments

Set `ENV=<env>` before running:

```bash
ENV=uat npm run test:uat
ENV=dev npm run test:dev
ENV=sit npm run test:sit
```

Config files live in `src/config/environments/<env>.env`.

## CI/CD

GitHub Actions runs a 4-shard parallel matrix on push to `main`/`develop`. Allure results are merged and published to GitHub Pages. Nightly regression runs at 2am UTC.

## Reporting

After a test run:
- Cucumber HTML: `reports/cucumber/index.html`
- Multi-cucumber HTML: `npm run report:html` → `reports/html/index.html`
- Allure: `npm run report:allure` (requires [Allure CLI](https://allurereport.org/docs/install/))
- Screenshots on failure: `reports/screenshots/`

## AI Prompt Library

See [`prompts/README.md`](prompts/README.md) for prompts to generate features, steps, page objects, and debug failures using Claude Code.
