# Flaky Test Diagnosis

Diagnose and fix a flaky (intermittently failing) test.

## Instructions

Given the test details below, identify the flakiness cause and provide a fix.

## Test Details

[PASTE SCENARIO NAME, STEP FILE, AND ANY FAILURE LOGS]

## Common Flakiness Causes

1. **Race condition**: element not yet in DOM when step runs
   - Fix: use `waitForVisible()` before interacting
   - Fix: use Playwright's built-in auto-waiting (prefer `locator.click()` over `locator.isVisible()` + `locator.click()`)

2. **Parallel worker conflict**: multiple workers hitting the same account
   - Fix: use different user roles per scenario, or run with `parallel: 1` for that feature

3. **Network timing**: slow response from saucedemo.com
   - Fix: increase `setDefaultTimeout` in hooks.ts (currently 15000ms)

4. **State leak**: previous scenario left the app in a bad state
   - Fix: ensure `After` hook closes context (already done in hooks.ts)
   - Fix: add explicit navigation to a known state in Background

5. **Selector ambiguity**: multiple elements match the selector
   - Fix: use `.first()` or a more specific selector

## Output

1. Most likely cause
2. Code fix
3. How to verify the fix resolved the flakiness
