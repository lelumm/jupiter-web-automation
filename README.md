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
├── specs/                    # Test plans written by the planner agent
├── playwright.config.ts      # Base URL, reporters, retries, browser project
├── .github/workflows/        # GitHub Actions pipeline
└── .claude/                  # Claude Code project skills and test agents
```

### Design

- **Page objects** hold locators and user actions, and extend `BasePage`. Navigation methods return the next page object, for example `homePage.goToContact()` returns a `ContactPage`.
- **Assertions live in specs**, not in page objects.
- **Fixtures** inject the page objects into tests. Specs import `test` and `expect` from `fixtures/`, never directly from `@playwright/test`.
- **Locators** are user-facing (`getByRole`, `getByText`), not CSS or XPath.
- **Money is handled as whole cents** to avoid floating-point rounding errors.
- **Slow submission:** the contact form takes about 15 seconds to confirm, so only that assertion has a 60 second timeout. There are no fixed sleeps.

## Playwright test agents

The repo includes [Playwright Test Agents](https://playwright.dev/docs/test-agents), set up with `npx playwright init-agents --loop=claude`. They run locally in Claude Code and are not part of CI.

| Agent | Definition | What it does |
| ----- | ---------- | ------------ |
| Planner | [.claude/agents/playwright-test-planner.md](.claude/agents/playwright-test-planner.md) | Explores the site in a browser and writes a Markdown test plan to `specs/` |
| Generator | [.claude/agents/playwright-test-generator.md](.claude/agents/playwright-test-generator.md) | Turns a plan into a spec under `tests/` by running each step in a real browser |
| Healer | [.claude/agents/playwright-test-healer.md](.claude/agents/playwright-test-healer.md) | Runs failing tests, inspects the live page, and patches the spec |

Supporting files:

- `specs/`: test plans written by the planner.
- [tests/seed.spec.ts](tests/seed.spec.ts): the starting state for the agents. It uses the repo fixtures and opens the home page.
- [.mcp.json](.mcp.json): registers the `playwright-test` MCP server the agents use, next to the general `playwright` server.

Each agent file ends with a "Project conventions" section so output follows this repo's rules: fixtures imports, page objects, user-facing locators, `@smoke`/`@regression` tags, and no fixed waits.

Typical flow:

1. Ask the planner to explore an area (for example the shop) and save a plan in `specs/`.
2. Ask the generator to create a spec from one plan item.
3. Review the generated spec: move raw locators into a page object, and rename it to `tests/<feature>/tcN-short-name.spec.ts`.
4. When a test breaks, ask the healer to fix it, then review the change.

Re-running `init-agents` (for example after a Playwright upgrade) overwrites the agent files, so check `git diff` and keep the "Project conventions" section. Generated tests are drafts and must pass `npm run typecheck` and `npm test` before they are committed.

## Continuous integration

[.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs on pushes and pull requests to `main`, and can be started manually from the Actions tab. It installs dependencies and Chromium, typechecks, runs the tests, and uploads the HTML report and `test-results/` as artifacts, including when tests fail.

In CI mode, JUnit results are written to `test-results/junit.xml`.

### Reports

| Reporter | Where | Output |
| -------- | ----- | ------ |
| `list` | Local and CI | Live pass/fail in the terminal |
| `html` | Local and CI | `playwright-report/` (steps, errors, screenshots, traces) |
| `junit` | CI only | `test-results/junit.xml` |

The report and `test-results/` are uploaded as the **playwright-report** artifact and kept for 30 days. A trace is captured on the first retry of a failing test.

To view a CI report:

1. Download the artifact from the **Artifacts** section at the bottom of the run summary in the Actions tab, or use the GitHub CLI:

   ```bash
   gh run list --limit 3                                    # find the run id
   gh run download <run-id> -n playwright-report -D ci-report
   ```

2. Open it with `npx playwright show-report ci-report/playwright-report`. Opening `index.html` directly can show a blank page, so use `show-report`.

`ci-report/` is not gitignored, so delete it when you are done.

## Adding a test

1. If the page has no page object yet, add one in `pages/` extending `BasePage`. Register it in `fixtures/index.ts` if specs will start from it.
2. Add the spec as `tests/<feature>/tcN-short-name.spec.ts`, one file per test case, using `test.step` for each step.
3. Tag it with `@smoke` or `@regression` in the title.
4. Run `npm run typecheck` and `npm test`.

## Troubleshooting

- **Browser not found:** run `npx playwright install chromium`.
- **Test fails on the success message:** the submission can take about 15 seconds. Check the report before changing the timeout.
- **See a failure in detail:** run `npm run report`, or run `npx playwright test --trace on` and open the trace with `npx playwright show-trace`.
