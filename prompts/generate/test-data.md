# Generate Test Data

Generate test user entries for `src/config/accounts/users.ts`.

## Context

The `users.ts` file exports `getUser(role, env)` and `getAllUsers(env)`.
Users are keyed by `UserRole` and `Environment`.

## Instructions

[DESCRIBE THE NEW USERS OR ROLES NEEDED]

## Output format

Add entries to the `users` map in `src/config/accounts/users.ts`:

```typescript
{ role: 'newrole', env: 'uat', username: 'newrole_user', password: 'secret_sauce' }
```

Also add `'newrole'` to the `UserRole` type in `src/types/index.ts`.
