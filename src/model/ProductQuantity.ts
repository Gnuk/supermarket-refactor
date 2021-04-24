import { Product } from './Product';
import { Quantity } from './Quantity';

export class ProductQuantity {
  constructor(public readonly product: Product, public readonly quantity: Quantity) {
    this.product = product;
    this.quantity = quantity;
  }
}
