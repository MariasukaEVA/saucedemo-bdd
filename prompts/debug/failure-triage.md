# Failure Triage

Diagnose a failing Cucumber scenario.

## Instructions

Given the failure output below, identify:

1. **Root cause** — what actually went wrong (selector, timing, data, logic)?
2. **Affected file** — which page object or step file needs fixing?
3. **Fix** — the minimal code change to resolve the issue

## Failure Output

[PASTE CUCUMBER FAILURE OUTPUT HERE]

## Screenshot

[ATTACH SCREENSHOT FROM reports/screenshots/ IF AVAILABLE]

## Common Root Causes in This Project

- **Selector mismatch**: SauceDemo uses slugified `data-test` names (e.g. `sauce-labs-backpack` not `Sauce Labs Backpack`)
- **Timeout**: `performance_glitch_user` adds a 5s delay — ensure `setDefaultTimeout(15000)` is set in hooks.ts
- **Wrong page**: step assumes a page that wasn't navigated to — check Background steps
- **Parallel conflict**: shared state between parallel workers — check if step modifies global state

## Output

Provide:
1. Root cause (1-2 sentences)
2. File and line to fix
3. The corrected code snippet
