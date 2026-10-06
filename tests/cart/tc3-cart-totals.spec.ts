import { test, expect } from '../../fixtures';
import { FLUFFY_BUNNY, STUFFED_FROG, VALENTINE_BEAR, type OrderLine } from '../../test-data/products';

const ORDER: OrderLine[] = [
  { product: STUFFED_FROG, quantity: 2 },
  { product: FLUFFY_BUNNY, quantity: 5 },
  { product: VALENTINE_BEAR, quantity: 3 },
];

test('TC3: prices, subtotals and total are correct @smoke', async ({ shopPage }) => {
  await test.step('Buy 2 Stuffed Frog, 5 Fluffy Bunny, 3 Valentine Bear', async () => {
    await shopPage.goto();
    await shopPage.buyAll(ORDER);
  });

  const cart = await test.step('Go to the cart page', () => shopPage.goToCart());

  let expectedTotal = 0;
  await test.step('Verify the price and subtotal for each product', async () => {
    for (const { product, quantity } of ORDER) {
      const row = await cart.getRow(product.name);

      expect.soft(row.priceCents, `${product.name} price`).toBe(product.priceCents);
      expect.soft(row.quantity, `${product.name} quantity`).toBe(quantity);
      expect.soft(row.subtotalCents, `${product.name} subtotal`).toBe(product.priceCents * quantity);

      expectedTotal += row.subtotalCents;
    }
  });

  await test.step('Verify that total = sum(sub totals)', async () => {
    expect(await cart.getTotalCents(), 'total = sum of subtotals').toBe(expectedTotal);
  });
});
