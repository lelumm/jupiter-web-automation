---
name: new-page-object
description: Scaffold a new page object in pages/ and register it as a fixture. Use when adding automation for a new page or UI component.
---

# New page object

Given a page name (e.g. `Pricing`):

1. Create `pages/PricingPage.ts` modeled on `pages/ContactPage.ts`:
   - `export class PricingPage extends BasePage`
   - no `path` needed: navigate via `NavBar` or `page.goto()` with a path relative to baseURL
   - `readonly` locators assigned in the constructor using role/label/text locators
   - async action methods for user workflows; no `expect` calls
2. Register in `fixtures/index.ts`: add `pricingPage: PricingPage` to the `Pages` type and `pricingPage: async ({ page }, use) => use(new PricingPage(page))` to `test.extend`.
3. Run `npm run typecheck`.

For reusable widgets (nav, modal), create `pages/components/<Name>.ts` taking a `Page` or parent `Locator`, and compose it inside page objects.
