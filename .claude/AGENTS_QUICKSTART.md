# Claude Code + Playwright Agents Quickstart

## What Are Playwright Agents?

Playwright Agents are LLM prompts optimized for Claude Code that help automate test creation, generation, and debugging. They come in three flavors:

| Agent | What It Does | Your Use Case |
|-------|-------------|---------------|
| 🎭 **Planner** | Explores your app, finds UI elements, creates test plans | Discover what to test before writing features |
| 🎭 **Generator** | Converts test plans into Playwright code | Spike complex interactions, generate scaffolds |
| 🎭 **Healer** | Analyzes test failures, suggests fixes | Debug flaky tests, update broken selectors |

## Using Agents in Claude Code

### Method 1: Invoke Agent Directly

In Claude Code Chat:

```
I want to use the Planner agent to explore the saucedemo login page.
What are all the interactive elements?
```

Or more specifically:

```
Use the Planner agent: https://www.saucedemo.com/
Generate a test plan for the "Add multiple items to cart and checkout" flow.
```

### Method 2: Import Agent Prompt

After running `npx playwright init-agents --loop=claude`, agent definitions are available as prompts.

In Claude Code:
1. Type `/` to open slash commands
2. Look for Playwright agent prompts
3. Or reference: `.agentloop/planner.md`, `.agentloop/generator.md`, `.agentloop/healer.md`

## Practical Workflows for SauceDemo BDD

### Workflow 1: Add a New Test Feature (Using Planner + Generator)

**Goal**: Create tests for **sorting inventory by price**

**Step 1: Ask Planner**

```
Use the Planner agent.
Target: https://www.saucedemo.com/inventory.html
Task: Identify all elements needed to test the "Sort by Price" functionality.
Include: sort dropdown location, item price display, order verification method.
```

**Planner Output** (example):
```markdown
# Sort Inventory Test Plan

## Elements Found:
- Sort Dropdown: [data-test="product_sort_container"]
- Option "Low to High": text="Low to High"
- Item Price: [data-test="inventory-item-price"]
- First Item: [data-test="inventory-item"] (first in list)

## Test Cases:
1. Sort Low to High → verify prices ascending
2. Sort High to Low → verify prices descending
3. Sort Name A-Z → verify alphabetical order
```

**Step 2: Ask Generator**

```
Use the Generator agent with this test plan.
Generate Playwright tests for sorting functionality.
Language: TypeScript, Framework: Playwright Test
```

**Generator Output** (example):
```typescript
test('sort inventory by price low to high', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.locator('[data-test="product_sort_container"]').selectOption('lohi');
  
  const prices = await page.locator('[data-test="inventory-item-price"]').allInnerTexts();
  const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
  
  for (let i = 0; i < numericPrices.length - 1; i++) {
    expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
  }
});
```

**Step 3: Adapt to Your BDD Format**

Add to `src/features/inventory/inventory.feature`:
```gherkin
Scenario: Sort inventory by price low to high
  Given I am logged in as standard_user
  When I navigate to the inventory page
  And I sort the inventory by "price-low-to-high"
  Then the items should be sorted by price in ascending order
```

Add to `src/steps/inventory/inventory.steps.ts`:
```typescript
When('I sort the inventory by {string}', async function (this: PlaywrightWorld, sortOption: string) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.sortBy(sortOption);
});

Then('the items should be sorted by price in ascending order', async function (this: PlaywrightWorld) {
  const inventoryPage = new InventoryPage(this.page);
  const prices = await inventoryPage.getAllItemPrices();
  const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
  
  for (let i = 0; i < numericPrices.length - 1; i++) {
    expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
  }
});
```

Add to `src/pages/inventory.page.ts`:
```typescript
async sortBy(option: string): Promise<void> {
  await this.selectOption('[data-test="product_sort_container"]', option);
  await this.page.waitForLoadState('networkidle');
}

async getAllItemPrices(): Promise<string[]> {
  return this.getAllTexts('[data-test="inventory-item-price"]');
}
```

---

### Workflow 2: Debug Failing Test (Using Healer)

**Goal**: Fix a test that's failing because selectors changed

**Your Test Fails**:
```
✗ I should see the logout button
  locator.click: Target page, context or browser has been closed
  at src/pages/main.page.ts:42
```

**Step 1: Run with Full Context**

```bash
npm run test:smoke 2>&1 | tee failure.log
# Playwright generates:
#   - Screenshot of failure
#   - Console logs
#   - Network requests
#   - Page structure
```

**Step 2: Ask Healer**

```
Use the Healer agent.
Analyze this test failure: [paste test output + screenshot]

The test tries to click logout button: [data-test="logout-btn"]
But it's failing with "Target... closed"

What changed? How do I fix it?
```

**Healer Suggests**:
```
The page structure may have changed. 
New logout location: [data-test="bm-logout"] or sidebar menu closes before click.
Add: await page.waitForSelector('[data-test="bm-logout"]', { timeout: 5000 });
Or: Use page.click() instead of locator.click() for side effects.
```

**Step 3: Apply Fix**

Update `src/pages/main.page.ts`:
```typescript
async logout(): Promise<void> {
  // Healer suggested these checks
  await this.waitForVisible('[data-test="bm-menu-button"]');
  await this.click('[data-test="bm-menu-button"]');
  
  // Updated selector
  await this.waitForVisible('[data-test="bm-logout"]');
  await this.click('[data-test="bm-logout"]');
}
```

**Step 4: Verify**

```bash
npm run test:smoke
# ✓ Logout test passes
```

---

### Workflow 3: Explore App for Coverage Gaps (Using Planner)

**Goal**: Identify untested features

**Ask Planner**:
```
Use the Planner agent: https://www.saucedemo.com/
Scan the entire app. What interactive features exist?
For each feature, note: element selectors, expected behaviors, edge cases.
Flag any features not covered by these existing tests:
- Login/logout
- Add to cart
- Remove from cart
- Checkout flow
```

**Planner Output** (example):
```markdown
# SauceDemo Coverage Analysis

## Existing Coverage:
✓ Login
✓ Add to cart
✓ Remove from cart
✓ Checkout (basic flow)

## Missing Coverage:
✗ Product detail page (click product image)
✗ Cart item quantity updates
✗ Filtering by category
✗ Social media links (footer)
✗ Error cases (network failures, invalid input)
✗ Mobile responsiveness
✗ Accessibility (keyboard navigation)

## Recommended Next Tests:
1. View product details: click any item → validate detail page loads
2. Update cart quantity: +/- buttons on cart page
3. Filter inventory: "Sauce Labs Backpack" only
```

**Step 5: Generate Tests for Top Priority**

```
Use Generator agent:
Create Playwright tests for: View Product Details
Requirements: Click product image, verify detail page, back button works
```

---

## Key Patterns: Adapting Agent Output to Your BDD

### Pattern 1: Selector Mapping

**Generator Output**:
```typescript
await page.locator('[data-test="item-price"]').click();
```

**BDD Adaptation**:
```typescript
// In page object:
get itemPrice() { return '[data-test="item-price"]'; }

async clickPrice(): Promise<void> {
  await this.click(this.itemPrice);
}

// In step:
When('I click the price', async function (this: PlaywrightWorld) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.clickPrice();
});
```

### Pattern 2: Assertion Adaptation

**Generator Output**:
```typescript
expect(page.url()).toContain('/checkout');
```

**BDD Adaptation**:
```typescript
Then('I should be on the checkout page', async function (this: PlaywrightWorld) {
  await expect(this.page).toHaveURL(/.*checkout/);
});
```

### Pattern 3: Complex Interaction Adaptation

**Generator Output**:
```typescript
const items = await page.locator('[data-test="inventory-item"]').allInnerTexts();
items.filter(item => item.includes('$20'));
```

**BDD Adaptation**:
```typescript
// In page object:
async getItemsByMaxPrice(maxPrice: number): Promise<string[]> {
  const items = await this.getAllTexts('[data-test="inventory-item"]');
  return items.filter(item => {
    const price = parseFloat(item.match(/\$[\d.]+/)?.[0] || '0');
    return price <= maxPrice;
  });
}

// In step:
When('I filter items under ${maxPrice}', async function (this: PlaywrightWorld, maxPrice: number) {
  const inventoryPage = new InventoryPage(this.page);
  const items = await inventoryPage.getItemsByMaxPrice(maxPrice);
  this.lastFilteredItems = items;
});
```

---

## Tips & Tricks

### Tip 1: Ask Planner for Your Specific User Flows
```
Use Planner to map these user journeys:
1. Guest visitor → sees login page → attempts login
2. Standard user → logs in → adds items to cart → checks out
3. Admin user → logs in → configures something

Provide selector paths for each step.
```

### Tip 2: Use Healer for Performance Issues
```
Test is slow. Healer agent, analyze:
- Why is this step taking 10 seconds?
- Can I use waitForLoadState() instead of fixed waits?
- Are there network requests I should wait for?
```

### Tip 3: Keep Agent Outputs in Git History
```bash
# Document when agent-generated code was added
git add src/steps/inventory/inventory.steps.ts
git commit -m "feat: add sorting tests (generated by Playwright Generator agent)"
```

### Tip 4: Iterate Quickly
```
1. Ask Planner for a feature
2. Ask Generator to create tests
3. Copy scaffolding into your BDD format
4. Run tests
5. If failed, ask Healer to debug
6. Repeat step 4-5 until passing
```

---

## Common Issues with Agents

### Issue: Generator Creates Playwright Test Syntax, Not Cucumber

**Solution**: This is expected. Generator uses `@playwright/test` syntax by default.
- Extract the locators and interactions
- Convert test blocks into `When()/Then()` steps
- Map `expect()` calls to your assertion style

### Issue: Healer Suggests Selectors That Don't Work

**Solution**: Verify with Planner again:
```
Planner, re-scan https://www.saucedemo.com/
Current selectors [old ones] don't work.
What are the correct data-test attributes?
```

### Issue: Agent Output Is Too Generic

**Solution**: Be specific in your prompts:
```
❌ Good: "Create tests"
✅ Better: "Create tests for standard_user login with password 'secret_sauce'"
✅ Best: "Create tests for auth flow using only [data-test] selectors, 
           for these users: [list], expected errors: [list]"
```

---

## Next Steps

1. **Verify installation**: `npm run test:smoke` passes
2. **Try Planner**: Ask it about the login page
3. **Try Generator**: Convert its output to one feature
4. **Try Healer**: Run tests, let it debug one failure
5. **Scale**: Use agents for your feature backlog

---

**Ready to use agents?** Start with the Planner! 🚀

