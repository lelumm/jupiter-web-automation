import type { Locator } from '@playwright/test';
import { toCents } from '../utils/money';
import { BasePage } from './BasePage';

export interface CartRow {
  priceCents: number;
  quantity: number;
  subtotalCents: number;
}

export class CartPage extends BasePage {
  private get total(): Locator {
    return this.page.getByText(/^Total:/);
  }

  private row(itemName: string): Locator {
    return this.page
      .getByRole('row')
      .filter({ has: this.page.getByRole('cell', { name: itemName, exact: true }) });
  }

  /** Reads the displayed price, quantity and subtotal of one cart line. */
  async getRow(itemName: string): Promise<CartRow> {
    const row = this.row(itemName);
    const cells = row.getByRole('cell');
    return {
      priceCents: toCents(await cells.nth(1).innerText()),
      quantity: Number(await row.getByRole('spinbutton').inputValue()),
      subtotalCents: toCents(await cells.nth(3).innerText()),
    };
  }

  async getTotalCents(): Promise<number> {
    return toCents(await this.total.innerText());
  }
}
