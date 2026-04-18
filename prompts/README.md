# Prompt Library

AI prompts for generating, reviewing, and debugging tests in this project.

## Usage with Claude Code

Run any prompt file with:
```bash
claude < prompts/generate/feature.md
```

Or paste the content into a Claude Code session.

## Prompts

### Generate
| File | Purpose |
|------|---------|
| `generate/feature.md` | Generate a Gherkin feature file from a user story |
| `generate/steps.md` | Generate step definitions for a feature file |
| `generate/page-object.md` | Generate a Page Object from a URL or HTML snippet |
| `generate/test-data.md` | Generate test data entries for `users.ts` |

### Review
| File | Purpose |
|------|---------|
| `review/test-quality.md` | Review a feature file for BDD best practices |
| `review/coverage-gap.md` | Identify missing test coverage |

### Debug
| File | Purpose |
|------|---------|
| `debug/failure-triage.md` | Triage a failing scenario from logs/screenshots |
| `debug/flaky-test.md` | Diagnose and fix a flaky test |

### CI
| File | Purpose |
|------|---------|
| `ci/shard-report.md` | Summarize a multi-shard CI run |

## Agentic Orchestration

See [`AGENTS.md`](../.claude/AGENTS.md) for how to use Claude Code as an orchestrator to generate full test suites from GitHub issues.
