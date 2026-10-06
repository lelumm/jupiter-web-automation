---
name: playwright-conventions
description: Coding conventions for this Playwright/TypeScript repo. Use when writing or reviewing any test, page object, or fixture here.
---

# Playwright conventions

1. **Imports**: `import { test, expect } from '../../fixtures'` (from tests/<feature>/). Never import `test` from `@playwright/test` in specs.
2. **Locators** (in priority order): `getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId`. Avoid XPath and CSS chains.
3. **Assertions**: web-first (`await expect(locator).toBeVisible()`); never `expect(await loc.isVisible())`.
4. **No fixed waits**: no `waitForTimeout`. Rely on auto-waiting and assertions.
5. **Isolation**: each test independent; no ordering dependence; use fixtures for setup/teardown instead of shared state.
6. **Page objects**: locators as `readonly` members built in the constructor, async action methods, no assertions. Extend `BasePage`.
7. **Config/secrets**: URLs and credentials come from `.env` via `process.env`; never hardcode.
8. **Tags**: `@smoke` (critical path, fast) and `@regression` in the `describe`/test title.
9. Always `await` Playwright calls; run `npm run typecheck` before finishing.
