# Agentic Orchestration Patterns

This document describes how to use Claude Code as an orchestrator to automate test generation and maintenance tasks.

## Overview

The orchestration model uses:
- **Orchestrator**: a top-level Claude Code session that plans and delegates
- **Subagents**: spawned Claude Code instances that execute specific tasks in parallel
- **Verification loop**: the orchestrator validates subagent output before committing

## Pattern 1: Generate Test Suite from GitHub Issue

**Trigger**: GitHub issue labeled `generate-test` (see `.github/workflows/generate-test.yml`)

**Orchestrator steps**:
1. Read the issue body
2. Spawn subagent: `prompts/generate/feature.md` with issue body as input
3. Write the generated artifacts to disk
4. Run `npx cucumber-js --dry-run` to verify step matching
5. If steps are Undefined: re-invoke subagent with error output for correction
6. Run `npm run tsc:check` to verify TypeScript
7. Open a PR with the generated files

**Subagent**: receives issue body, returns feature file + step definitions + page object additions

## Pattern 2: Parallel Coverage Gap Analysis

**Trigger**: manual or scheduled

**Orchestrator steps**:
1. Spawn 4 subagents in parallel, one per feature domain:
   - Subagent A: analyze `auth/` coverage
   - Subagent B: analyze `inventory/` coverage
   - Subagent C: analyze `cart/` coverage
   - Subagent D: analyze `checkout/` coverage
2. Collect results from all 4 subagents
3. Synthesize into a prioritized gap report
4. Optionally: spawn generation subagents for high-priority gaps

## Pattern 3: Failure Triage Pipeline

**Trigger**: CI run fails

**Orchestrator steps**:
1. Download failed scenario logs and screenshots from CI artifacts
2. For each failed scenario, spawn a subagent with `prompts/debug/failure-triage.md`
3. Subagents run in parallel (one per failure)
4. Orchestrator collects fixes and applies them
5. Re-run the failing scenarios to verify fixes

## Subagent Communication Protocol

Subagents should return structured output:

```
RESULT: SUCCESS | FAILURE | NEEDS_REVIEW

ARTIFACTS:
- path: src/features/...
  content: |
    [file content]

- path: src/steps/...
  content: |
    [file content]

NOTES:
[any caveats or follow-up actions]
```

## Running Orchestrated Tasks with Claude Code

```bash
# Generate tests from an issue
claude "Read GitHub issue #42, generate a feature file and steps following prompts/generate/feature.md, verify with dry-run, then open a PR"

# Parallel coverage analysis
claude "Run coverage gap analysis on all 4 feature domains in parallel using prompts/review/coverage-gap.md, then synthesize the results"

# Triage CI failures
claude "Download the latest failed CI run artifacts, triage each failure using prompts/debug/failure-triage.md, and apply fixes"
```

## Key Principles

1. **Verify before commit**: always run `--dry-run` and `tsc:check` before writing to git
2. **Parallel where safe**: subagents reading different files can run in parallel
3. **Sequential where dependent**: step generation depends on feature generation
4. **Human in the loop**: orchestrator opens PRs, not direct pushes to main
5. **Idempotent**: re-running the same prompt should produce the same result
