# saucedemo-bdd — Comprehensive Walkthrough

## What this project is

A **BDD test automation framework** for [saucedemo.com](https://www.saucedemo.com) — a demo e-commerce site. The stack is:

- **Cucumber** — runs `.feature` files written in plain English (Gherkin)
- **Playwright** — controls the browser
- **TypeScript** — types everything
- **ts-node** — runs TypeScript directly without compiling first

---

## Directory map (src/)

```
src/
├── config/
│   ├── env.config.ts           ← loads BASE_URL, HEADLESS, etc. from .env files
│   ├── accounts/users.ts       ← test credentials by role (standard, locked, etc.)
│   ├── environments/           ← uat.env, dev.env, sit.env, prod.env
│   └── locales/en.json         ← i18n strings
│
├── types/index.ts              ← TypeScript interfaces (EnvConfig, TestUser, etc.)
│
├── fixtures/
│   ├── world.ts                ← THE shared context: this.page, this.config
│   └── hooks.ts                ← browser lifecycle + screenshot on failure
│
├── pages/                      ← Page Object Model
│   ├── base.page.ts            ← click/fill/getText/navigate wrappers
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   └── checkout.page.ts
│
├── features/                   ← Gherkin scenarios (plain English)
│   ├── auth/login.feature
│   ├── inventory/inventory.feature
│   ├── cart/cart.feature
│   └── checkout/checkout.feature
│
├── steps/                      ← Gherkin → TypeScript glue code
│   ├── shared/common.steps.ts  ← reusable steps (login, add to cart, etc.)
│   ├── auth/login.steps.ts
│   ├── inventory/inventory.steps.ts
│   ├── cart/cart.steps.ts
│   └── checkout/checkout.steps.ts
│
└── utils/
    ├── logger.ts               ← colored console output
    ├── screenshot.ts           ← saves PNG on failure
    └── i18n.ts                 ← t('key', locale) helper
```

---

## The execution flow — step by step

```
npm run test:uat
    │
    ▼
cucumber.config.js
  - finds src/features/**/*.feature
  - loads src/fixtures/world.ts  (registers PlaywrightWorld)
  - loads src/fixtures/hooks.ts  (registers lifecycle hooks)
  - loads src/steps/**/*.steps.ts (registers step definitions)
    │
    ▼
hooks.ts: BeforeAll
  - launches a shared Chromium browser (headless by default)
    │
    ▼
For each Scenario:
  hooks.ts: Before
    - creates a new BrowserContext + Page
    - attaches them to this.browser / this.context / this.page
    │
    ▼
  Gherkin steps execute
    - each step calls a function in a .steps.ts file
    - steps use this.page (from World) to create page objects
    - page objects use BasePage methods to interact with the browser
    │
    ▼
  hooks.ts: After
    - if FAILED → takes a screenshot, attaches it to the report
    - closes the BrowserContext
    │
    ▼
hooks.ts: AfterAll
  - closes the shared browser
    │
    ▼
Reports written:
  - reports/cucumber/index.html
  - reports/cucumber/report.json
  - allure-results/ (for Allure)
```

---

## The 3 core concepts

### 1. PlaywrightWorld (`world.ts`)

This is the **shared state container** for every scenario. Every step function gets `this` typed as `PlaywrightWorld`, giving access to:

```typescript
this.page    // Playwright Page — interact with the browser
this.config  // EnvConfig — baseUrl, env, locale, viewport, headless
this.browser // Browser instance (rarely needed in steps)
this.context // BrowserContext (rarely needed in steps)
```

### 2. Page Object Model (`pages/`)

Each page on the site has a class. Locators are **getters** returning `data-test` selector strings. Actions are **async methods** that compose those getters:

```typescript
// inventory.page.ts
get cartBadge() { return '[data-test="shopping-cart-badge"]'; }

async addItemToCart(itemName: string) {
  await this.click(`[data-test="add-to-cart-${slugify(itemName)}"]`);
}
```

`BasePage` provides the primitives (`click`, `fill`, `getText`, etc.) so page classes stay clean.

### 3. Step Definitions (`steps/`)

The glue between Gherkin and page objects. Always typed with `this: PlaywrightWorld`:

```typescript
When('I add {string} to the cart', async function (this: PlaywrightWorld, itemName: string) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.addItemToCart(itemName);
});
```

---

## Feature files and tags

```gherkin
@smoke @regression
Feature: Inventory

  Background:
    Given I am logged in as "standard" user   ← defined in common.steps.ts

  @smoke
  Scenario: Add a product to cart
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1
```

Tags control which scenarios run:

- `@smoke` — critical path, fast
- `@regression` — full coverage

Run selectively: `npm run test:smoke` or `--tags @smoke`

---

## Environment system

`ENV=uat` → loads `src/config/environments/uat.env` → populates `EnvConfig`:

| Key | Default | Purpose |
|-----|---------|---------|
| `BASE_URL` | `https://www.saucedemo.com` | Site URL |
| `HEADLESS` | `true` | Show browser? |
| `SLOW_MO` | `0` | Slow down actions (ms) |
| `LOCALE` | `en` | Browser locale |
| `VIEWPORT` | `desktop` | desktop or mobile |

---

## Test users

`getUser(role, env)` in `users.ts` returns credentials. Never hardcoded in tests:

| Role | Username | Behavior |
|------|----------|---------|
| `standard` | standard_user | Normal |
| `locked` | locked_out_user | Login blocked |
| `problem` | problem_user | UI glitches |
| `performance` | performance_glitch_user | 5s delay |
| `error` | error_user | Backend errors |
| `visual` | visual_user | Visual diffs |

---

## Reporting

After a run you get three report types:

```bash
reports/cucumber/index.html     ← built-in Cucumber HTML (auto-generated)
npm run report:html             ← richer multi-cucumber HTML → reports/html/
npm run report:allure           ← Allure (requires Allure CLI installed)
reports/screenshots/            ← auto-saved PNGs for failed scenarios
```

---

## CI/CD

`.github/workflows/ci.yml` runs a **4-shard parallel matrix** on push to `main`/`develop`:

- Each shard runs a quarter of the scenarios
- Allure results from all 4 shards are merged
- Published to GitHub Pages

`.github/workflows/generate-test.yml` is the agentic pipeline — label a GitHub issue `generate-test` and Claude Code auto-generates the feature/steps/page object and opens a PR.

---

## Quick reference — common commands

```bash
npm run test:uat              # full suite, UAT
npm run test:smoke            # @smoke only
ENV=uat npx cucumber-js --config cucumber.config.js --tags @regression
npx cucumber-js --config cucumber.config.js --dry-run   # verify steps match (no browser)
npm run tsc:check             # TypeScript type check
npm run report:html           # generate HTML report
```

---

## Key mental model

> **Feature files** describe *what* to test.
> **Step definitions** bridge *what* to *how*.
> **Page objects** own the *how*.
> **World** carries the shared state (page + config) across all of them.
