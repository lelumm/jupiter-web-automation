---
name: debug-failing-test
description: Diagnose a failing or flaky Playwright test in this repo. Use when a test fails, times out, or passes intermittently.
---

# Debug a failing test

1. Reproduce alone: `npx playwright test <file> -g "<title>" --project=chromium --retries=0`.
2. Read the error: locator not found vs. assertion mismatch vs. timeout vs. navigation/baseURL (check `.env` `BASE_URL`).
3. Inspect: `--debug` (step through), `--headed`, or `--trace on` then `npx playwright show-trace test-results/<dir>/trace.zip`. Screenshots are in `test-results/`.
4. Fix the cause, not the symptom:
   - Wrong/brittle locator -> use a role/label locator, update the page object.
   - Race condition -> add a web-first assertion on the state you need; never `waitForTimeout`.
   - Shared state -> make the test independent via fixtures.
   - Slow backend -> the contact submit takes ~15s; raise the timeout on that one assertion only.
5. Flakiness check: `npx playwright test <file> --repeat-each=10`.
6. Finish with `npm run typecheck` and report actual results.
