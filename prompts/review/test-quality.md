# Review Test Quality

Review a feature file or step file for BDD best practices.

## Checklist

Evaluate the provided file against these criteria:

### Feature File
- [ ] Feature has a clear As a / I want / So that description
- [ ] Scenarios are named clearly (describe the outcome, not the steps)
- [ ] Steps are written from the user's perspective
- [ ] No UI implementation details in Gherkin (no "click button", prefer "submit the form")
- [ ] Background is used for shared setup (not repeated in every scenario)
- [ ] Scenario Outlines used for data-driven cases
- [ ] Tags are appropriate (@smoke for critical, @regression for full coverage)
- [ ] No more than ~5 steps per scenario
- [ ] Scenarios are independent (no shared state between scenarios)

### Step Definitions
- [ ] `this: PlaywrightWorld` typed on every step
- [ ] No hardcoded credentials (uses `getUser`)
- [ ] No `page.waitForTimeout()`
- [ ] Uses page objects (not raw `this.page.locator()`)
- [ ] Assertions use `expect` from `@playwright/test`
- [ ] Steps are reusable (not too specific to one scenario)

## File to Review

[PASTE FILE CONTENT HERE]

## Output

Provide:
1. A score (1-10) for overall quality
2. List of issues found (with line numbers if possible)
3. Suggested rewrites for the worst issues
