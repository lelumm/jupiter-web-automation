import type { Page } from '@playwright/test';
import { NavBar } from './components/NavBar';

export abstract class BasePage {
  readonly nav: NavBar;

  constructor(protected readonly page: Page) {
    this.nav = new NavBar(page);
  }
}
