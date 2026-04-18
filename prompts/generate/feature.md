# Generate Feature File (Orchestrated)

> **Orchestration note**: This prompt is designed to be used by an AI orchestrator
> (e.g. Claude Code) that spawns subagents to generate a complete test suite from
> a GitHub issue. See `.claude/AGENTS.md` for the full orchestration pattern.

Generate a Gherkin feature file for the saucedemo-bdd project.

## Context

Project: Playwright + Cucumber BDD + TypeScript
Target site: https://www.saucedemo.com
Conventions:
- Tags: @smoke for critical path, @regression for full coverage
- Background: use "Given I am logged in as {string} user" for authenticated scenarios
- Step style: imperative ("When I click") not declarative ("When the button is clicked")
- No UI implementation details in feature files

## User Story / Issue

[PASTE USER STORY OR GITHUB ISSUE BODY HERE]

## Instructions

### Step 1 — Analyze
Read the user story and identify:
- Feature domain (auth/inventory/cart/checkout/other)
- Happy path scenarios (tag @smoke)
- Error/edge case scenarios (tag @regression)
- Reusable steps from `src/steps/shared/common.steps.ts`

### Step 2 — Generate Feature File
Write the `.feature` file following project conventions.

### Step 3 — Identify Required Steps
List which steps are NEW (not in existing step files) and need to be generated.

### Step 4 — Identify Required Page Object Methods
List which page object methods are NEW and need to be added.

### Step 5 — Output Artifacts
Output each artifact clearly labeled:

**ARTIFACT: feature file**
```gherkin
// content
```
Save to: `src/features/<domain>/<name>.feature`

**ARTIFACT: step definitions**
```typescript
// content
```
Save to: `src/steps/<domain>/<name>.steps.ts`

**ARTIFACT: page object additions**
```typescript
// content (additions to existing page object, or new file)
```
Save to: `src/pages/<name>.page.ts`

## Orchestration Subagent Instructions

When used as a subagent in an orchestrated pipeline:
1. Receive the issue body as input
2. Generate all three artifacts
3. Return artifacts as structured output for the orchestrator to write to disk
4. The orchestrator will then run `npx cucumber-js --dry-run` to verify step matching
5. If dry-run shows Undefined steps, the orchestrator will re-invoke this prompt with the error output
