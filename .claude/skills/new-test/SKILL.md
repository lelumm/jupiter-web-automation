---
name: new-test
description: Write a new Playwright spec for a user flow in this repo. Use when asked to add or automate a test case.
---

# New test

1. Put the spec in `tests/<feature>/tcN-short-name.spec.ts` (one file per test case; create the feature folder if needed).
2. Follow the `playwright-conventions` skill. Template:

```ts
import { test, expect } from '../../fixtures';

test('TCn: <user-visible behaviour> @regression', async ({ somePage }) => {
  await test.step('<step from the test case>', async () => {
    await somePage.goto();
    await somePage.doThing();
  });

  await test.step('<verification from the test case>', async () => {
    await expect(somePage.result).toBeVisible();
  });
});
```

3. If a page object is missing, use the `new-page-object` skill first.
4. Mark critical, fast flows `@smoke`.
5. Verify: `npx playwright test <file> --project=chromium`, then `npm run typecheck`. Report real pass/fail output.
