# jupiter-web-automation

Playwright + TypeScript end-to-end tests for Jupiter Toys (https://jupiter.cloud.planittesting.com). Object-oriented (page objects + fixtures), CI via GitHub Actions.

## Layout
- `tests/<feature>/` – one spec file per test case: `contact/tc1-contact-errors`, `contact/tc2-contact-submit` (x5 runs), `cart/tc3-cart-totals`
- `pages/` – page objects extending `BasePage`; `pages/components/NavBar.ts` shared nav. Navigation methods return the next page object (e.g. `homePage.goToContact()`)
- `fixtures/index.ts` – `test.extend()` registers page objects; exports `test` and `expect`
- `test-data/` – typed data (products with prices in cents, contact details); `utils/money.ts` – `toCents`
- `.github/workflows/playwright.yml` – GitHub Actions pipeline (typecheck + tests, uploads report); CI mode (`CI=true`, set automatically by Actions) adds JUnit output at `test-results/junit.xml`
- `BASE_URL` env var overrides the default site (see `.env.example`)

## Commands
- `npm test` / `npm run test:smoke` (`@smoke`) / `npm run test:ui` / `npm run test:headed`
- `npm run typecheck`, `npm run report`

## Rules
- Specs import `test`/`expect` from `fixtures/`, never from `@playwright/test`.
- Locators: `getByRole` / `getByLabel` / `getByText` first; no XPath or brittle CSS.
- Web-first assertions only; no `waitForTimeout`; assertions live in specs, not page objects.
- New page object => register it in `fixtures/index.ts` if specs start from it.
- Money is handled as integer cents. Contact submission takes ~15s (long timeout on that assertion only).
- Tag tests with `@smoke` or `@regression`.

Project skills in `.claude/skills/`: playwright-conventions, new-page-object, new-test, debug-failing-test.
