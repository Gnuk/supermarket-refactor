import * as _ from 'lodash';

import { Discount } from './Discount';
import { Offer } from './Offer';
import { Product } from './Product';
import { ProductQuantity } from './ProductQuantity';
import { Receipt } from './Receipt';
import { SpecialOfferType } from './SpecialOfferType';
import { SupermarketCatalog } from './SupermarketCatalog';

type ProductQuantities = Record<string, ProductQuantity>;
export type OffersByProduct = Record<string, Offer>;

export class ShoppingCart {
  private readonly items: ProductQuantity[] = [];
  _productQuantities: ProductQuantities = {};

  getItems(): ProductQuantity[] {
    return _.clone(this.items);
  }

  productQuantities(): ProductQuantities {
    return this._productQuantities;
  }

  public addItemQuantity(product: Product, quantity: number): void {
    const productQuantity = new ProductQuantity(product, quantity);
    this.items.push(productQuantity);
    const currentQuantity = this._productQuantities[product.name];
    if (currentQuantity) {
      this._productQuantities[product.name] = this.increaseQuantity(product, currentQuantity, quantity);
    } else {
      this._productQuantities[product.name] = productQuantity;
    }
  }

  private increaseQuantity(product: Product, productQuantity: ProductQuantity, quantity: number) {
    return new ProductQuantity(product, productQuantity.quantity + quantity);
  }

  handleOffers(receipt: Receipt, offers: OffersByProduct, catalog: SupermarketCatalog): void {
    for (const productName in this.productQuantities()) {
      const productQuantity = this._productQuantities[productName];
      const product = productQuantity.product;
      const quantity: number = this._productQuantities[productName].quantity;
      if (offers[productName]) {
        const offer: Offer = offers[productName];
        const unitPrice: number = catalog.getUnitPrice(product);
        const quantityAsInt = quantity;
        let discount: Discount | null = null;
        let x = 1;
        let numberOfXs;
        if (offer.offerType == SpecialOfferType.ThreeForTwo) {
          x = 3;
          numberOfXs = Math.floor(quantityAsInt / x);
          if (quantityAsInt > 2) {
            const discountAmount = quantity * unitPrice - (numberOfXs * 2 * unitPrice + (quantityAsInt % 3) * unitPrice);
            discount = new Discount(product, '3 for 2', discountAmount);
          }
        } else if (offer.offerType == SpecialOfferType.TwoForAmount) {
          x = 2;
          if (quantityAsInt >= 2) {
            const total = offer.argument * Math.floor(quantityAsInt / x) + (quantityAsInt % 2) * unitPrice;
            const discountN = unitPrice * quantity - total;
            discount = new Discount(product, '2 for ' + offer.argument, discountN);
          }
          numberOfXs = Math.floor(quantityAsInt / x);
        }
        if (offer.offerType == SpecialOfferType.FiveForAmount) {
          x = 5;
          numberOfXs = Math.floor(quantityAsInt / x);
        }
        if (offer.offerType == SpecialOfferType.TenPercentDiscount) {
          discount = new Discount(product, offer.argument + '% off', (quantity * unitPrice * offer.argument) / 100.0);
        }
        if (offer.offerType == SpecialOfferType.FiveForAmount && quantityAsInt >= 5) {
          const discountTotal = unitPrice * quantity - (offer.argument * numberOfXs + (quantityAsInt % 5) * unitPrice);
          discount = new Discount(product, x + ' for ' + offer.argument, discountTotal);
        }
        if (discount != null) receipt.addDiscount(discount);
      }
    }
  }
}
