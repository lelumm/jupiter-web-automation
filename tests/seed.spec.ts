import { test, expect } from '../fixtures';

// Seed for the Playwright test agents (planner / generator / healer).
// The agents start from the state this test sets up.
test('seed @smoke', async ({ homePage }) => {
  await homePage.goto();
  await expect(homePage.nav.contact).toBeVisible();
});
