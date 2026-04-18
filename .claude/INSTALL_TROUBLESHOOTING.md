# Playwright 1.56 Upgrade - Installation Status & Troubleshooting

## Current Status ✅

- **package.json**: Updated to `playwright@^1.56.0` and `@playwright/test@^1.56.0`
- **Installed Version**: Playwright 1.58.2 (compatible, newer than 1.56)
- **Agent Guide**: Created at [.claude/PLAYWRIGHT_AGENTS_GUIDE.md](./.claude/PLAYWRIGHT_AGENTS_GUIDE.md)

## NPM Cache Issue 🔧

You're encountering an npm cache permission issue on Windows, likely caused by:
- Antivirus software locking cache files
- VS Code or another process holding file locks
- File system permissions on `D:\Sandbox\nodejs\node_cache`

### Immediate Workaround

**Option 1: Disable npm Cache Temporarily** (Recommended)
```powershell
npm config set cache D:\Sandbox\npm-cache-temp
npm install
```

**Option 2: Use PowerShell as Administrator**
1. Close all VS Code instances
2. Open PowerShell as Administrator
3. Run:
```powershell
cd "D:\Sandbox\Claude_Code\saucedemo-bdd"
npm cache clean --force
npm install --no-optional
```

**Option 3: Clear Cache Manually**
```powershell
# Close all Node processes first
Get-Process node | Stop-Process -Force

# Remove cache
Remove-Item "D:\Sandbox\nodejs\node_cache" -Recurse -Force
mkdir "D:\Sandbox\nodejs\node_cache-new"

# Configure new cache location
npm config set cache "D:\Sandbox\nodejs\node_cache-new"

# Reinstall
cd "D:\Sandbox\Claude_Code\saucedemo-bdd"
npm install
```

**Option 4: Use Docker or Cloud IDE** (If Local Issues Persist)
- CodeSandbox, GitHub Codespaces, or StackBlitz can bypass local system issues

## Next Steps After Successful Install

### 1. Verify Playwright Installation
```bash
npx playwright --version
# Should show: Version 1.56.0 or higher
```

### 2. Initialize Playwright Agents
```bash
npx playwright init-agents --loop=claude
```

This creates:
- `.agentloop/` directory with agent configurations
- Ready-to-use prompt templates for Planner, Generator, and Healer

### 3. Test Your Setup
```bash
# Run your BDD tests to ensure everything works
npm run test:smoke

# Or test a single feature
ENV=dev npx cucumber-js features/auth/login.feature
```

## Using Playwright Agents in VS Code

### Scenario 1: Generate Tests for a New Feature

1. **Use Planner Agent**:
   - In Claude Code Chat, mention "I want to use the Planner agent"
   - Provide the feature URL: https://www.saucedemo.com
   - Ask: "Create a test plan for implementing a wishlist feature"

2. **Use Generator Agent**:
   - Provide the Planner's output
   - Ask: "Generate Playwright tests for this plan"
   - Receive: `.spec.ts` files with test code

3. **Adapt to BDD**:
   - Convert generated `test()` blocks into Cucumber `When()`, `Then()` steps
   - Extract page selectors into your page objects
   - Follow your existing patterns in `src/steps/` and `src/pages/`

### Scenario 2: Debug Failing Tests

1. **Use Healer Agent**:
   - Run: `npm run test:smoke 2>&1 | tee test-results.log`
   - Share the failure output with Healer: "Analyze these test failures"
   - Healer suggests:
     - Updated selectors (if app changed)
     - Timing adjustments (if waits needed)
     - StepDef suggestions (if steps are unclear)

2. **Apply Fixes**:
   - Healer provides corrected selectors and steps
   - You validate and merge changes into your codebase

### Scenario 3: Page Object Discovery

1. Ask Planner: "What page elements exist on the checkout page?"
2. Planner: Returns all found data-test attributes and their purposes
3. Use Generator: "Create page object methods from these elements"
4. Generator: Provides method stubs to add to your page classes

## File Locations

| File | Purpose |
|------|---------|
| [`package.json`](../../package.json) | Updated to `playwright@^1.56.0` |
| [`.claude/PLAYWRIGHT_AGENTS_GUIDE.md`](./.claude/PLAYWRIGHT_AGENTS_GUIDE.md) | Comprehensive agent usage guide |
| [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) | Your project context (loaded by Claude Code) |
| `src/pages/base.page.ts` | Your page object base class |
| `src/steps/` | Your Cucumber step definitions |

## Verification Checklist

- [ ] npm install completes successfully
- [ ] `npm run test:smoke` passes
- [ ] `npx playwright init-agents --loop=claude` creates agent files
- [ ] Can access `.agentloop/` or equivalent agent prompts
- [ ] TypeScript check passes: `npm run tsc:check`
- [ ] Linter passes: `npm run lint`

## Testing Playwright Agent Integration

Once installed, test the agents:

```typescript
// Example: Using Healer to fix a failing step

// Original failing step:
When('I add {string} to cart', async function (this: PlaywrightWorld, itemName: string) {
  const inventoryPage = new InventoryPage(this.page);
  // Selector may have changed in app
  await inventoryPage.addToCart(`add-to-cart-${itemName.toLowerCase()}`);
});

// Healer might suggest:
// "The selector has changed. Use [data-test=\"add-to-cart\"] instead"
// Then you update the page object with correct selectors
```

## Still Having Issues?

**Check these first**:
1. Is VS Code closed? (helps with file locks)
2. Is your antivirus scanning node_modules? (check settings)
3. Are there any npm processes running? (`Get-Process node`)
4. Do you have disk space available? (`Disk Usage`)

**Contact/Escalate**:
If issues persist after trying the options above:
1. Try in a fresh PowerShell/Command Prompt window
2. Restart your machine
3. Install Node.js to a different directory (e.g., `C:\Dev\nodejs`)
4. Consider using a virtual environment or DevContainer

## Resources

- [Playwright Agents Documentation](https://playwright.dev/docs/test-agents)
- [Playwright Release Notes v1.56](https://github.com/microsoft/playwright/releases/tag/v1.56.0)
- Your BDD Project Guide: [WALKTHROUGH.md](../../WALKTHROUGH.md)
- Your Project Plan: [PLAN.md](../../PLAN.md)

---

**Created**: March 22, 2026  
**Updated for**: Playwright 1.56+  
**Status**: Ready for agent integration after npm install

