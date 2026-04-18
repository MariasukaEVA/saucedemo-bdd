# Claude GitHub Actions — Setup Guide

## What Is It?

**Claude GitHub Actions** (`anthropics/claude-code-action`) is Anthropic's official GitHub Action that embeds Claude Code directly into your CI/CD workflows. It can read your repo, write code, create commits, open PRs, and post review comments — triggered by PR events, issue comments, or scheduled runs.

---

## What It Can Do

| Capability | Description |
|---|---|
| **Code review** | Auto-reviews PRs for bugs, security issues, style violations |
| **`@claude` comments** | Mention `@claude` in any PR/issue comment and it takes action |
| **Issue-to-PR automation** | Label an issue and Claude implements it as a PR |
| **Test failure analysis** | Analyze Cucumber JSON reports and open issues with findings |
| **On-demand tasks** | Run any task via `workflow_dispatch` |

---

## Prerequisites

| Requirement | Details |
|---|---|
| **Anthropic API Key** | Get one at [console.anthropic.com](https://console.anthropic.com) |
| **GitHub repository** | Any public or private repo |
| **GitHub Actions enabled** | Must be enabled in repo settings |
| **Secret configured** | `ANTHROPIC_API_KEY` stored in repo/org secrets |

---

## Setup Steps

### Step 1 — Add Your API Key as a GitHub Secret

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: your key from `console.anthropic.com`

### Step 2 — Create a Workflow File

Choose one or more of the examples below and place them in `.github/workflows/`.

---

## Workflow Examples

### Example A: `@claude` Comment Trigger (Most Useful)

Users mention `@claude` in any PR or issue comment and Claude takes action.

```yaml
# .github/workflows/claude.yml
name: Claude Code Agent

on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]

jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

**Usage examples:**
- `@claude please write a new step for adding multiple items to cart`
- `@claude review this PR for security issues`
- `@claude fix the failing login scenario`

---

### Example B: Automated PR Code Review

Claude automatically reviews every pull request when opened or updated.

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            You are an expert code reviewer. Review the changes in this pull request.
            Focus on:
            - Bugs or logic errors
            - Security vulnerabilities
            - Performance issues
            - Test coverage gaps
            - Adherence to project conventions (see CLAUDE.md)
            Post your review as inline comments where appropriate.
```

---

### Example C: Issue-to-PR Automation

Add a `claude-implement` label to an issue and Claude implements it as a PR.

```yaml
# .github/workflows/claude-implement.yml
name: Claude Implement Issue

on:
  issues:
    types: [labeled]

jobs:
  implement:
    if: github.event.label.name == 'claude-implement'
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Read this GitHub issue and implement the requested feature or fix.
            Issue title: ${{ github.event.issue.title }}
            Issue body: ${{ github.event.issue.body }}

            Follow the project conventions in CLAUDE.md.
            Create a new branch, make the changes, and open a pull request.
```

---

### Example D: Test Failure Analysis (Tailored to This Project)

Triggers after the scheduled regression run and analyzes Cucumber JSON reports when tests fail.

```yaml
# .github/workflows/claude-test-analysis.yml
name: Claude Test Failure Analysis

on:
  workflow_run:
    workflows: ["Scheduled Regression"]
    types: [completed]

jobs:
  analyze:
    if: github.event.workflow_run.conclusion == 'failure'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      issues: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: cucumber-report
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: |
            Analyze the Cucumber JSON test report in reports/cucumber-report.json.
            Identify which scenarios failed, what the root cause likely is,
            and suggest specific fixes in the step files or page objects.
            Open a GitHub issue summarizing your findings.
```

---

### Example E: On-Demand Manual Task

Run Claude on demand for any task via the GitHub Actions UI.

```yaml
# .github/workflows/claude-manual.yml
name: Claude On-Demand Task

on:
  workflow_dispatch:
    inputs:
      task:
        description: 'What should Claude do?'
        required: true
        type: string

jobs:
  claude-task:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: ${{ github.event.inputs.task }}
```

---

## Key Configuration Options

```yaml
uses: anthropics/claude-code-action@v1
with:
  anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}

  # The instruction/task for Claude (optional when using @claude trigger)
  prompt: "Review this PR for security issues"

  # Claude model to use
  model: "claude-opus-4-6"

  # Max agentic back-and-forth turns (default: 10)
  max_turns: 15

  # Restrict which shell tools Claude can use
  allowed_tools: "bash,read_file,write_file,git"

  # Custom system prompt for extra project context
  system_prompt: "You are an expert in Playwright BDD testing."
```

---

## Security Considerations

| Concern | Mitigation |
|---|---|
| **Secret exposure** | API key lives only in GitHub Secrets, never in YAML |
| **Malicious fork PRs** | Add `if: github.event.pull_request.head.repo.full_name == github.repository` |
| **Runaway API costs** | Set `max_turns` limit; monitor usage at `console.anthropic.com` |
| **Unreviewed commits** | Require PR reviews even for Claude-created PRs via branch protection rules |
| **Tool scope** | Use `allowed_tools` to restrict what Claude can execute |

---

## How It Fits This Project (`saucedemo-bdd`)

### Current Workflow Status

| File | Purpose | Has Claude? |
|---|---|---|
| `.github/workflows/ci.yml` | Main test runs (4-shard matrix) | No |
| `.github/workflows/scheduled-regression.yml` | Nightly regression | No |
| `.github/workflows/generate-test.yml` | Test generation | No |

### Recommended Additions (in priority order)

1. **`@claude` comment trigger** — ask Claude to generate step definitions, fix failing scenarios, or update page objects directly from PR comments
2. **PR review** — Claude enforces `CLAUDE.md` rules on every PR (no `waitForTimeout`, only `data-test` selectors, use `getUser()`, etc.)
3. **Test failure analysis** — connects to `scheduled-regression.yml` so Claude auto-opens issues when overnight scenarios fail

### Your `CLAUDE.md` Is Already Wired In

The `.claude/CLAUDE.md` file in this repo is **automatically picked up** by the action as its system context. When Claude runs in CI, it already knows your project's rules, structure, and conventions — no extra configuration needed.

---

## References

- [Claude Code Action on GitHub](https://github.com/anthropics/claude-code-action)
- [Anthropic Console (API Keys)](https://console.anthropic.com)
- [GitHub Actions Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
