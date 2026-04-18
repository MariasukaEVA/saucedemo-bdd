---
name: push-to-remote
description: "Use when: pushing BDD test automation project code to a remote GitHub repository. Handles git initialization, staging, committing, remote setup, and pushing with GitHub MCP integration. Verifies git configuration, creates commits with proper author info, establishes GitHub remote, and executes authenticated push operations."
---

# Push Code to Remote Repository

## Overview
Complete workflow for initializing a local git repository, preparing code for version control, creating a GitHub repository, and pushing code with proper authentication and tracking setup.

## When to Use
- Setting up a new project on GitHub for the first time
- Pushing BDD/Playwright test automation code to remote
- Need to configure git author info and remote tracking
- Using GitHub MCP for authenticated push operations

## Prerequisites
- Local project ready for version control
- `.gitignore` properly configured (or willing to create)
- GitHub account with MCP authentication enabled
- GitPython or git CLI available locally

## Phase 1: Initialize Local Git Repository

### 1.1 Initialize Git
```bash
git init
```

### 1.2 Verify .gitignore Configuration
Ensure `.gitignore` exists with common exclusions:
- `node_modules/` — dependency cache
- `allure-results/` — test report artifacts
- `reports/` — generated test reports
- `test-results/` — test execution logs
- `.env` — environment variables (use `.env.example` instead)
- `dist/`, `build/` — build output

## Phase 2: Prepare Files for Commit

### 2.1 Check Git Status
```bash
git status
```

### 2.2 Stage Files
```bash
git add .
```

Or selectively stage:
```bash
git add src/ specs/ package.json tsconfig.json playwright.config.ts cucumber.config.ts
```

## Phase 3: Configure Git Author & Commit

### 3.1 Set Git User Configuration
```bash
git config user.name "YourName"
git config user.email your@email.com
```

### 3.2 Create Initial Commit
```bash
git commit -m "Initial commit: BDD test automation project with Playwright and Cucumber"
```

## Phase 4: Set Up Remote Repository

### 4.1 Create Repository on GitHub
Using GitHub MCP:
```python
# Pseudo-code — actual MCP handles this
owner = "your-github-username"
repo_name = "saucedemo-bdd"
repo = create_repository(
    name=repo_name,
    description="Playwright + Cucumber BDD test automation",
    private=False,
    autoInit=False
)
```

Expected output:
```
{"id":"1214015600","url":"https://github.com/your-username/saucedemo-bdd"}
```

### 4.2 Add Remote to Local Repository
```bash
git remote add origin https://github.com/your-username/saucedemo-bdd.git
```

### 4.3 Verify Remote Configuration
```bash
git remote -v
```

Expected output:
```
origin  https://github.com/your-username/saucedemo-bdd.git (fetch)
origin  https://github.com/your-username/saucedemo-bdd.git (push)
```

## Phase 5: Push to Remote

### 5.1 Configure Main Branch & Push
```bash
git branch -M main
git push -u origin main
```

### 5.2 Verify Push Success
```bash
git branch -vv
```

Expected output: `* main <hash> [origin/main] Initial commit...`

## Pre-Push Verification Checklist

- [ ] **Source Code Ready**: All production code in `src/` committed
- [ ] **Test Specs Ready**: All feature files in `specs/` committed
- [ ] **Configuration Files**: `package.json`, `tsconfig.json`, `playwright.config.ts`, `cucumber.config.ts` committed
- [ ] **Documentation**: `README.md` with setup instructions present
- [ ] **.gitignore Configured**: Excludes sensitive and temporary files
- [ ] **No Credentials**: No hardcoded passwords, API keys, or `.env` files
- [ ] **Author Info Set**: Git user name and email configured
- [ ] **Remote URL Correct**: GitHub repository exists and URL matches
- [ ] **GitHub Auth Active**: MCP authentication working (verified via `mcp_io_github_git_get_me`)

## Files to Include in Version Control

### ✅ Commit These:
```
src/                      # All source code
specs/                    # BDD feature files
package.json              # Dependencies
package-lock.json         # Dependency lock
tsconfig.json             # TypeScript config
playwright.config.ts      # Playwright config
cucumber.config.{js,ts}   # Cucumber config
README.md                 # Project documentation
.gitignore                # Git ignore rules
.github/workflows/        # CI/CD pipelines
```

### ❌ Exclude via .gitignore:
```
node_modules/             # Dependencies (install via npm)
.env                      # Local env vars (use .env.example)
reports/                  # Generated test reports
allure-results/           # Allure report artifacts
test-results/             # Test execution logs
dist/                     # Build output
build/                    # Build output
*.log                     # Log files
```

## Post-Push Steps (Optional)

### Repository Configuration
1. **Enable Branch Protection** on `main`:
   - Require pull request reviews
   - Require status checks to pass
   - Dismiss stale pull requests

2. **Configure Secrets** for CI/CD:
   - GitHub Actions runner credentials
   - Environment-specific configurations

3. **Set Up CI/CD Pipelines**:
   - GitHub Actions workflows for test execution
   - Auto-deployment on merge

4. **Add Collaborators**:
   - Team members with appropriate permissions
   - PR review requirements

5. **Configure Issue/PR Templates**:
   - Standardized issue templates
   - PR checklist and description guidelines

## Troubleshooting

### Push Authentication Fails
**Error**: `fatal: The ServicePointManager does not support proxies with the socks5h scheme`
- **Solution**: Ensure GitHub MCP authentication is properly configured
- Check that `.mcp.json` includes GitHub integration
- Verify personal access token or SSH key setup

### CRLF vs LF Warnings
**Error**: `LF will be replaced by CRLF the next time Git touches it`
- **Solution**: Expected on Windows systems; warnings can be suppressed:
  ```bash
  git config --global core.safecrlf false
  ```

### Remote URL Already Exists
**Error**: `fatal: remote origin already exists`
- **Solution**: Remove and re-add:
  ```bash
  git remote remove origin
  git remote add origin https://github.com/your-username/saucedemo-bdd.git
  ```

### Branch Not Tracking Remote
**Error**: `* main abc123... Initial commit` (no `[origin/main]`)
- **Solution**: Push with upstream tracking:
  ```bash
  git push -u origin main
  ```

## Related Documentation
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI Docs](https://cli.github.com/)
- [GitHub MCP Reference](../../../.claude/CLAUDE.md)
- Project Planning: [PLAN.md](../../../PLAN.md)
- Setup Walkthrough: [WALKTHROUGH.md](../../../WALKTHROUGH.md)
