import type { Locator, Page } from '@playwright/test';

export class NavBar {
  readonly home: Locator;
  readonly shop: Locator;
  readonly contact: Locator;
  readonly cart: Locator;

  constructor(page: Page) {
    this.home = page.getByRole('link', { name: 'Home', exact: true });
    this.shop = page.getByRole('link', { name: 'Shop', exact: true });
    this.contact = page.getByRole('link', { name: 'Contact', exact: true });
    this.cart = page.getByRole('link', { name: /^Cart/ });
  }
}
