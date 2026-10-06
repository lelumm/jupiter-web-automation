import type { Locator } from '@playwright/test';
import type { OrderLine, Product } from '../test-data/products';
import { BasePage } from './BasePage';
import { CartPage } from './CartPage';

export class ShopPage extends BasePage {
  async goto() {
    await this.page.goto('/#/shop');
  }

  private buyButton(product: Product): Locator {
    return this.page
      .getByRole('listitem')
      .filter({ has: this.page.getByRole('heading', { name: product.name, exact: true }) })
      .getByRole('link', { name: 'Buy' });
  }

  async buy(product: Product, quantity = 1) {
    for (let i = 0; i < quantity; i++) {
      await this.buyButton(product).click();
    }
  }

  async buyAll(lines: OrderLine[]) {
    for (const { product, quantity } of lines) {
      await this.buy(product, quantity);
    }
  }

  async goToCart(): Promise<CartPage> {
    await this.nav.cart.click();
    return new CartPage(this.page);
  }
}
