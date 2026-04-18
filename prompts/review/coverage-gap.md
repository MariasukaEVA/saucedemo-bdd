# Coverage Gap Analysis

Identify missing test coverage in the saucedemo-bdd project.

## Instructions

Review the existing feature files and identify:

1. **Untested user flows** — what can a user do that isn't covered?
2. **Missing error cases** — what error states aren't tested?
3. **Missing edge cases** — boundary values, empty states, etc.
4. **Missing user roles** — are all roles (standard, locked, problem, performance, error, visual) tested where relevant?
5. **Missing @smoke coverage** — are all critical paths tagged @smoke?

## Existing Features

- `src/features/auth/login.feature` — login happy/sad paths, multiple roles
- `src/features/inventory/inventory.feature` — product listing, sorting, add/remove cart
- `src/features/cart/cart.feature` — cart management, continue shopping
- `src/features/checkout/checkout.feature` — full checkout, validation errors

## Output

For each gap found:
- **Gap**: description of what's missing
- **Priority**: High / Medium / Low
- **Suggested scenario**: a Gherkin snippet for the missing coverage
