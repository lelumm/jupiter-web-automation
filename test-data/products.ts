export interface Product {
  name: string;
  /** Expected unit price in cents */
  priceCents: number;
}

export const STUFFED_FROG: Product = { name: 'Stuffed Frog', priceCents: 1099 };
export const FLUFFY_BUNNY: Product = { name: 'Fluffy Bunny', priceCents: 999 };
export const VALENTINE_BEAR: Product = { name: 'Valentine Bear', priceCents: 1499 };

export interface OrderLine {
  product: Product;
  quantity: number;
}
