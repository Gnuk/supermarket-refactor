import * as _ from 'lodash';

import { Discount } from './Discount';
import { Product } from './Product';
import { ReceiptItem } from './ReceiptItem';

export class Receipt {
  private items: ReceiptItem[] = [];
  private discounts: Discount[] = [];

  public getTotalPrice(): number {
    const itemsPrice = this.getItemsPrice();
    const discount = this.getDiscount();
    return itemsPrice - discount;
  }

  private getDiscount(): number {
    return this.discounts.reduce((previous, current) => previous + current.discountAmount, 0);
  }

  private getItemsPrice(): number {
    return this.items.reduce((previous, current) => previous + current.totalPrice, 0);
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
