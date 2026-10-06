# Jupiter Web Automation

End-to-end UI tests for [Jupiter Toys](https://jupiter.cloud.planittesting.com), built with [Playwright](https://playwright.dev) and TypeScript. The suite uses object-oriented design (page objects and fixtures) and runs in GitHub Actions.

## Test cases

| ID  | Spec | What it checks |
| --- | ---- | -------------- |
| TC1 | [tests/contact/tc1-contact-errors.spec.ts](tests/contact/tc1-contact-errors.spec.ts) | From the home page, open the contact page and click Submit. Verify the mandatory-field errors, populate the fields, and verify the errors are gone. |
| TC2 | [tests/contact/tc2-contact-submit.spec.ts](tests/contact/tc2-contact-submit.spec.ts) | Populate the mandatory fields, submit, and verify the success message. Runs as 5 independent tests to confirm a 100% pass rate. |
| TC3 | [tests/cart/tc3-cart-totals.spec.ts](tests/cart/tc3-cart-totals.spec.ts) | Buy 2 Stuffed Frog, 5 Fluffy Bunny and 3 Valentine Bear. In the cart, verify each price and subtotal, and that total = sum of subtotals. |

Each step of a test case is a named `test.step`, so it appears line by line in the report.

## Prerequisites

- Node.js 20 or later (LTS recommended)
- Internet access to the Jupiter site

## Setup

```bash
npm ci                          # install dependencies
npx playwright install chromium # download the browser
```

If the browser download times out on a slow connection:

```bash
PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=180000 npx playwright install chromium
```

## Running the tests

| Goal | Command |
| ---- | ------- |
| Run everything | `npm test` |
| Run one test case | `npx playwright test tests/contact/tc1-contact-errors.spec.ts` |
| Run one feature folder | `npx playwright test tests/contact` |
| Run by name | `npx playwright test -g "TC3"` |
| Run only `@smoke` tests | `npm run test:smoke` |
| Watch the browser | `npm run test:headed` |
| Interactive UI mode | `npm run test:ui` |
| Open the HTML report | `npm run report` |
| Typecheck | `npm run typecheck` |

Tests run headless on Chromium by default.

## Configuration

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `BASE_URL` | `https://jupiter.cloud.planittesting.com` | Site under test |
| `CI` | unset | When set (GitHub Actions sets it automatically): 1 retry, 2 workers, JUnit output |

Copy `.env.example` to `.env` to override locally. `.env` is gitignored.

## Project structure

```
.
├── tests/                    # Specs, grouped by feature, one file per test case
│   ├── contact/
│   │   ├── tc1-contact-errors.spec.ts
│   │   └── tc2-contact-submit.spec.ts
│   └── cart/
│       └── tc3-cart-totals.spec.ts
├── pages/                    # Page objects (locators and user actions)
│   ├── BasePage.ts           # Shared base: exposes the nav bar
│   ├── HomePage.ts
│   ├── ContactPage.ts
│   ├── ShopPage.ts
│   ├── CartPage.ts
│   └── components/
│       └── NavBar.ts         # Navigation shared by every page
├── fixtures/
│   └── index.ts              # Registers page objects; exports test and expect
├── test-data/                # Typed test data (products, contact details)
├── utils/                    # Helpers (e.g. money.ts converts "$10.99" to cents)
├── playwright.config.ts      # Base URL, reporters, retries, browser project
├── .github/workflows/        # GitHub Actions pipeline
└── .claude/skills/           # Claude Code project skills
```

### Design

- **Page objects** hold locators and user actions, and extend `BasePage`. Navigation methods return the next page object, for example `homePage.goToContact()` returns a `ContactPage`.
- **Assertions live in specs**, not in page objects.
- **Fixtures** inject the page objects into tests. Specs import `test` and `expect` from `fixtures/`, never directly from `@playwright/test`.
- **Locators** are user-facing (`getByRole`, `getByText`), not CSS or XPath.
- **Money is handled as whole cents** to avoid floating-point rounding errors.
- **Slow submission:** the contact form takes about 15 seconds to confirm, so only that assertion has a 60 second timeout. There are no fixed sleeps.

## Continuous integration

[.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs on pushes and pull requests to `main` or `master`, and can be started manually from the Actions tab. It installs dependencies and Chromium, typechecks, runs the tests, and uploads the HTML report and `test-results/` as artifacts, including when tests fail.

In CI mode, JUnit results are written to `test-results/junit.xml`.

## Adding a test

1. If the page has no page object yet, add one in `pages/` extending `BasePage`. Register it in `fixtures/index.ts` if specs will start from it.
2. Add the spec as `tests/<feature>/tcN-short-name.spec.ts`, one file per test case, using `test.step` for each step.
3. Tag it with `@smoke` or `@regression` in the title.
4. Run `npm run typecheck` and `npm test`.

## Troubleshooting

- **Browser not found:** run `npx playwright install chromium`.
- **Test fails on the success message:** the submission can take about 15 seconds. Check the report before changing the timeout.
- **See a failure in detail:** run `npm run report`, or run `npx playwright test --trace on` and open the trace with `npx playwright show-trace`.
