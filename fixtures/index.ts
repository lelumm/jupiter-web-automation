import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';

type Pages = {
  homePage: HomePage;
  shopPage: ShopPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  shopPage: async ({ page }, use) => use(new ShopPage(page)),
});

export { expect } from '@playwright/test';
