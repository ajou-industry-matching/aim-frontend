# Security dependency response plan

Updated: 2026-02-20

## 1) @isaacs/brace-expansion (Dependabot alert #1)

- Issue: Uncontrolled Resource Consumption / DoS
- Action: Force patched transitive version through pnpm override
- Applied override:

```json
"pnpm": {
  "overrides": {
    "@isaacs/brace-expansion": ">=5.0.1"
  }
}
```

- Verification:
  - `pnpm-lock.yaml` resolves `@isaacs/brace-expansion@5.0.1`
  - `pnpm why @isaacs/brace-expansion` shows resolved path at 5.0.1

## 2) ajv (Dependabot alert #2)

- Issue: ReDoS when using `$data` option
- Current path: `eslint` transitively depends on `ajv@6.12.6`
- Risk assessment:
  - Low for normal frontend build/lint workflow where untrusted schemas are not parsed.
  - Elevated only if untrusted external schema input with `$data` is evaluated at runtime in tooling context.
- Interim action:
  - Do not force `ajv` major override yet (risk of ESLint/runtime incompatibility).
  - Monitor `eslint` and `@eslint/js` updates via Dependabot.
- Final action trigger:
  - When ESLint officially supports/ships `ajv` v8 path, perform either:
    1. direct ESLint upgrade, or
    2. targeted override validated by lint/test.

## Monitoring

Dependabot configuration is managed in `.github/dependabot.yml` (weekly check for `eslint`, `@eslint/js`).
