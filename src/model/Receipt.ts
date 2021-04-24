import * as _ from 'lodash';

import { Discount } from './Discount';
import { Product } from './Product';
import { ReceiptItem } from './ReceiptItem';

export class Receipt {
  private items: ReceiptItem[] = [];
  private discounts: Discount[] = [];

  public getTotalPrice(): number {
    let total = 0.0;
    for (const item of this.items) {
      total += item.totalPrice;
    }
    for (const discount of this.discounts) {
      total -= discount.discountAmount;
    }
    return total;
  }

  public addProduct(p: Product, quantity: number, price: number, totalPrice: number): void {
    this.items.push(new ReceiptItem(p, quantity, price, totalPrice));
  }

  public getItems(): ReceiptItem[] {
    return _.clone(this.items);
  }

  public addDiscount(discount: Discount): void {
    this.discounts.push(discount);
  }

  public getDiscounts(): Discount[] {
    return this.discounts;
  }
}
