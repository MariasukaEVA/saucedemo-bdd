# CI Shard Report Summary

Summarize the results of a multi-shard GitHub Actions CI run.

## Instructions

Given the CI run output or artifact list below, provide:

1. **Overall result**: pass/fail, total scenarios, pass rate
2. **Per-shard summary**: which shards passed/failed
3. **Failed scenarios**: list with feature file and scenario name
4. **Flaky indicators**: scenarios that passed in some shards but failed in others
5. **Recommended action**: fix now / investigate / re-run

## CI Run Data

[PASTE GITHUB ACTIONS RUN URL OR ARTIFACT CONTENTS]

## Output Format

```
Run: #<number> | Branch: <branch> | Trigger: <push/PR/schedule>
Result: PASS/FAIL | Scenarios: X passed, Y failed, Z total

Shard 1: PASS (X/Y)
Shard 2: FAIL (X/Y)
Shard 3: PASS (X/Y)
Shard 4: PASS (X/Y)

Failed Scenarios:
- [Shard 2] src/features/checkout/checkout.feature: Complete a full checkout
  Error: ...

Recommended Action: ...
```
