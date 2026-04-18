# Playwright + Cucumber BDD + TypeScript Enterprise POC — Implementation Plan

## Project Location
`D:\Sandbox\Claude_Code\saucedemo-bdd`
Bash path: `/d/Sandbox/Claude_Code/saucedemo-bdd`

---

## Implementation Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Scaffold | ✅ Done |
| 2 | Infrastructure | ✅ Done |
| 3 | Login Flow | ✅ Done |
| 4 | Inventory, Cart, Checkout | ✅ Done |
| 5 | Reporting | ✅ Done |
| 6 | CI/CD (GitHub Actions) | ✅ Done |
| 7 | AI Rules + Polish | ✅ Done |
| 8 | Prompt Library | ✅ Done |
| 9 | Agentic Subagent Orchestration POC | ✅ Done |
| 10 | GitHub Issue Label → Pipeline Trigger | ✅ Done |

---

## Phase 1 — Scaffold ✅

**Files created:**
- `package.json` — deps: @cucumber/cucumber@10, playwright@1.44, typescript@5, ts-node, allure-cucumberjs, multiple-cucumber-html-reporter, dotenv, eslint
- `tsconfig.json` — strict: false, path aliases @pages/@steps/@config/@utils
- `.gitignore`
- `.env.example`
- `src/config/environments/uat.env` + `dev.env` + `sit.env` + `prod.env`
- `src/types/index.ts` — TestUser, EnvConfig, UserRole, Environment, Locale, ViewportType interfaces

**Verified:** `npx tsc --noEmit` passes with no errors.

---

## Phase 2 — Infrastructure 🔶

**Files created:**
- `src/config/env.config.ts` — dotenv loader, returns EnvConfig
- `src/config/accounts/users.ts` — getUser(role, env) + getAllUsers(env)
- `src/config/locales/en.json` + `fr.json`
- `src/utils/i18n.ts` — t('key', locale) helper
- `src/utils/logger.ts` — colored console logger
- `src/utils/screenshot.ts` — takeScreenshot(page, name)
- `src/fixtures/world.ts` — PlaywrightWorld with browser/context/page/config
- `src/fixtures/hooks.ts` — BeforeAll/AfterAll (browser), Before/After (context+page, screenshot on fail)
- `src/pages/base.page.ts` — BasePage with click/fill/getText/isVisible/navigate wrappers
- `cucumber.config.js` — paths, require, ts-node, format (HTML + JSON), parallel: 4
- `playwright.config.ts` — projects: desktop-chrome, mobile-chrome (Pixel 5), mobile-safari (iPhone 13)

**Also created (jumped ahead for dry-run):**
- `src/pages/login.page.ts`
- `src/features/auth/login.feature`
- `src/steps/auth/login.steps.ts`

**Blocker:** `npx cucumber-js --dry-run` shows steps as Undefined — ts-node is not loading the `.ts` step files from the config. Root cause not yet resolved. Next session should fix this first.

**Known issue:** `cucumber.config.ts` (TypeScript) is not supported by Cucumber's config loader — replaced with `cucumber.config.js`. The `.ts` version can be deleted.

---

## Phase 3 — Login Flow ⬜

Files to create (partially done — see Phase 2 blocker):
- `src/pages/login.page.ts` ✅ created
- `src/features/auth/login.feature` ✅ created
- `src/steps/auth/login.steps.ts` ✅ created

Pending: fix dry-run, then run `npm run test:uat -- --tags @smoke`

---

## Phase 4 — Inventory, Cart, Checkout ⬜

Files to create:
- `src/pages/inventory.page.ts`
- `src/pages/cart.page.ts`
- `src/pages/checkout.page.ts`
- `src/pages/components/header.component.ts`
- `src/pages/components/sidebar.component.ts`
- `src/features/inventory/inventory.feature`
- `src/features/cart/cart.feature`
- `src/features/checkout/checkout.feature`
- `src/steps/inventory/inventory.steps.ts`
- `src/steps/cart/cart.steps.ts`
- `src/steps/checkout/checkout.steps.ts`
- `src/steps/shared/common.steps.ts`

---

## Phase 5 — Reporting ⬜

- Verify Cucumber HTML report at `reports/cucumber/index.html`
- Add `multiple-cucumber-html-reporter` post-processing script
- Verify Allure: `npm run report:allure`
- Add `allure-cucumberjs` formatter back to `cucumber.config.js` once dry-run is fixed

---

## Phase 6 — CI/CD ⬜

Files to create:
- `.github/workflows/ci.yml` — 4-shard matrix, artifact upload, Allure merge, GitHub Pages publish
- `.github/workflows/scheduled-regression.yml` — nightly full suite
- Manual `workflow_dispatch` with `tags` + `environment` inputs

---

## Phase 7 — AI Rules + Polish ⬜

Files to create:
- `.claude/CLAUDE.md` — project context, POM patterns, step patterns, do-not rules
- `.cursorrules` — Copilot autocomplete preferences
- Tag all scenarios: @smoke, @regression, @e2e
- `README.md`

---

## Phase 8 — Prompt Library ⬜

Files to create:
```
prompts/
├── README.md
├── generate/
│   ├── feature.md
│   ├── steps.md
│   ├── page-object.md
│   └── test-data.md
├── review/
│   ├── test-quality.md
│   └── coverage-gap.md
├── debug/
│   ├── failure-triage.md
│   └── flaky-test.md
└── ci/
    └── shard-report.md
```

---

## Phase 9 — Agentic Subagent Orchestration POC ⬜

- `prompts/generate/feature.md` — annotated orchestration prompt
- `prompts/README.md` — explains orchestrator/subagent/parallel concepts
- `.claude/AGENTS.md` — documents orchestration patterns

---

## Phase 10 — GitHub Issue Label → Pipeline Trigger ⬜

- `.github/workflows/generate-test.yml` — `issues: [labeled]` trigger
- Label `generate-test` → reads issue body → runs Claude Code → opens PR

---

## Key Technical Decisions

| Concern | Decision |
|---------|----------|
| TypeScript strictness | `strict: false` |
| Locator strategy | `data-test` attributes only |
| Shared state | Cucumber World (`world.ts`) |
| Env config | dotenv per env, `.env` for local overrides |
| Mobile | `VIEWPORT=mobile` + Playwright device projects |
| i18n | `t('key', locale)` + JSON locale files |
| Reporting | Cucumber HTML (fast) + Allure (rich) |
| Sharding | 4 GitHub Actions matrix jobs |
| Cucumber config format | `.js` (not `.ts` — unsupported by Cucumber loader) |

---

## Resume Prompt

Use this in a new Claude Code session to continue from where we left off:

```
I have a Playwright + Cucumber BDD + TypeScript POC called `saucedemo-bdd` at:
D:\Sandbox\Claude_Code\saucedemo-bdd

## What's done
- Phase 1 (Scaffold) is complete. npx tsc --noEmit passes.
- Phase 2 (Infrastructure) files are all created but has one blocker:
  `npx cucumber-js --dry-run` shows all steps as Undefined — ts-node is not
  loading the .ts step/fixture files from cucumber.config.js.

## Blocker to fix first
The cucumber.config.js has:
  requireModule: ['ts-node/register'],
  require: ['src/fixtures/world.ts', 'src/fixtures/hooks.ts', 'src/steps/**/*.steps.ts']

But running:
  node -r ts-node/register ./node_modules/@cucumber/cucumber/bin/cucumber.js \
    --config cucumber.config.js --dry-run 'src/features/**/*.feature'
...still shows steps as Undefined.

Fix the ts-node + Cucumber integration so the dry-run shows all steps as matched
(not undefined). Then continue with the remaining phases in order:

## Remaining phases
- Phase 3: Run npm run test:uat -- --tags @smoke (login.feature, login.page.ts,
  login.steps.ts already exist — just need the dry-run fixed first)
- Phase 4: inventory/cart/checkout pages, features, steps
- Phase 5: Reporting (HTML + Allure)
- Phase 6: CI/CD (.github/workflows/ci.yml — 4-shard, Allure, GitHub Pages)
- Phase 7: .claude/CLAUDE.md, .cursorrules, README.md
- Phase 8: prompts/ folder (generate/review/debug/ci)
- Phase 9: Agentic orchestration POC (prompts/generate/feature.md + AGENTS.md)
- Phase 10: .github/workflows/generate-test.yml (issue label → PR)

## Key rules
- Locators: data-test attributes only, no XPath
- Shared state: Cucumber World (world.ts) — this.page, this.config
- Steps always typed: `this: PlaywrightWorld`
- No page.waitForTimeout() — fix root causes
- Credentials never hardcoded — always from users.ts

Read PLAN.md in the project root for full context before starting.
```
