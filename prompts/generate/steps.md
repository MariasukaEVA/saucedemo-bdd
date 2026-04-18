# Generate Step Definitions

Generate Cucumber step definitions for a feature file in the saucedemo-bdd project.

## Context

- Step files live in `src/steps/<domain>/<name>.steps.ts`
- Always type `this: PlaywrightWorld` on every step function
- Import `PlaywrightWorld` from `../../fixtures/world`
- Use page objects — never interact with `this.page` directly in steps
- Use `getUser(role, env)` from `../../config/accounts/users` for credentials
- No `page.waitForTimeout()` — use Playwright auto-waiting

## Feature File

[PASTE FEATURE FILE HERE]

## Existing Steps to Reuse

Check `src/steps/shared/common.steps.ts` for already-defined steps:
- `Given I am logged in as {string} user`
- `Given I have added {string} to the cart`
- `Given I am on the cart page`
- `When I add {string} to the cart`
- `When I remove {string} from the cart`
- `When I go to the cart`
- `Then I should be on the inventory page`

## Instructions

1. List which steps from the feature are already covered by existing step files
2. Generate only the NEW step definitions needed
3. Group steps by Given/When/Then
4. Create or reference the appropriate page object
5. Use `expect` from `@playwright/test` for assertions

## Output format

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PlaywrightWorld } from '../../fixtures/world';
import { MyPage } from '../../pages/my.page';

When('I do something', async function (this: PlaywrightWorld) {
  const page = new MyPage(this.page);
  await page.doSomething();
});
```

Save to: `src/steps/<domain>/<name>.steps.ts`
