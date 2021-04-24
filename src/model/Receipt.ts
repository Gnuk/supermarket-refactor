import * as _ from 'lodash';

import { Discount } from './Discount';
import { Price } from './Price';
import { Product } from './Product';
import { ReceiptItem } from './ReceiptItem';

export class Receipt {
  private items: ReceiptItem[] = [];
  private discounts: Discount[] = [];

  public getTotalPrice(): Price {
    const itemTotal: Price = this.items.reduce((previous, current) => previous.add(Price.of(current.totalPrice)), Price.of(0));
    const discountTotal: Price = this.discounts.reduce((previous, current) => previous.add(current.discountAmount), Price.of(0));
    return itemTotal.substract(discountTotal);
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
