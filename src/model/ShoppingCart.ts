import * as _ from 'lodash';

import { Discount } from './Discount';
import { Offer } from './Offer';
import { Price } from './Price';
import { Product } from './Product';
import { ProductQuantity } from './ProductQuantity';
import { Quantity } from './Quantity';
import { Receipt } from './Receipt';
import { SpecialOfferType } from './SpecialOfferType';
import { SupermarketCatalog } from './SupermarketCatalog';

type ProductQuantities = { [productName: string]: ProductQuantity };
export type OffersByProduct = { [productName: string]: Offer };

export class ShoppingCart {
  private readonly items: ProductQuantity[] = [];
  _productQuantities: ProductQuantities = {};

  getItems(): ProductQuantity[] {
    return _.clone(this.items);
  }

  productQuantities(): ProductQuantities {
    return this._productQuantities;
  }

  public addItemQuantity(product: Product, quantity: Quantity): void {
    const productQuantity = new ProductQuantity(product, quantity);
    this.items.push(productQuantity);
    const currentQuantity = this._productQuantities[product.name];
    if (currentQuantity) {
      this._productQuantities[product.name] = this.increaseQuantity(product, currentQuantity, quantity);
    } else {
      this._productQuantities[product.name] = productQuantity;
    }
  }

  private increaseQuantity(product: Product, productQuantity: ProductQuantity, quantity: Quantity) {
    return new ProductQuantity(product, productQuantity.quantity.add(quantity));
  }

  handleOffers(receipt: Receipt, offers: OffersByProduct, catalog: SupermarketCatalog): void {
    for (const productName in this.productQuantities()) {
      const productQuantity = this._productQuantities[productName];
      const product = productQuantity.product;
      const quantity: Quantity = this._productQuantities[productName].quantity;
      if (offers[productName]) {
        const offer: Offer = offers[productName];
        let x = 1;
        if (offer.offerType == SpecialOfferType.ThreeForTwo) {
          const unitPrice: Price = catalog.getUnitPrice(product);
          const quantityAsInt = quantity.get();
          x = 3;
          const numberOfXs = Math.floor(quantityAsInt / x);
          if (quantityAsInt > 2) {
            const discountAmount: Price = Price.of(
              quantity.get() * unitPrice.get() - (numberOfXs * 2 * unitPrice.get() + (quantityAsInt % 3) * unitPrice.get())
            );
            const discount = new Discount(product, '3 for 2', discountAmount);
            receipt.addDiscount(discount);
          }
        }
        if (offer.offerType == SpecialOfferType.TwoForAmount) {
          const unitPrice: Price = catalog.getUnitPrice(product);
          const quantityAsInt = quantity.get();
          x = 2;
          if (quantityAsInt >= 2) {
            const total = offer.argument * Math.floor(quantityAsInt / x) + (quantityAsInt % 2) * unitPrice.get();
            const discountN: Price = Price.of(unitPrice.multiply(quantity).get() - total);
            const discount = new Discount(product, '2 for ' + offer.argument, discountN);
            receipt.addDiscount(discount);
          }
        }
        if (offer.offerType == SpecialOfferType.FiveForAmount) {
          const unitPrice: Price = catalog.getUnitPrice(product);
          const quantityAsInt = quantity.get();
          x = 5;
          if (quantityAsInt >= 5) {
            const numberOfXs = Math.floor(quantityAsInt / x);
            const discountTotal = Price.of(
              unitPrice.multiply(quantity).get() - (offer.argument * numberOfXs + (quantityAsInt % 5) * unitPrice.get())
            );
            const discount = new Discount(product, x + ' for ' + offer.argument, discountTotal);
            receipt.addDiscount(discount);
          }
        }
        if (offer.offerType == SpecialOfferType.TenPercentDiscount) {
          const unitPrice: Price = catalog.getUnitPrice(product);
          const discount = new Discount(
            product,
            offer.argument + '% off',
            Price.of((unitPrice.multiply(quantity).get() * offer.argument) / 100.0)
          );
          receipt.addDiscount(discount);
        }
      }
    }
  }
}
