import { Product } from '../src/model/Product';
import { ProductUnit } from '../src/model/ProductUnit';
import { Quantity } from '../src/model/Quantity';
import { Receipt } from '../src/model/Receipt';
import { ShoppingCart } from '../src/model/ShoppingCart';
import { SpecialOfferType } from '../src/model/SpecialOfferType';
import { SupermarketCatalog } from '../src/model/SupermarketCatalog';
import { Teller } from '../src/model/Teller';
import { ReceiptPrinter } from '../src/ReceiptPrinter';

import { FakeCatalog } from './FakeCatalog';

const print = (receipt: Receipt): string => {
  const receiptPrinter = new ReceiptPrinter();

  return receiptPrinter.printReceipt(receipt);
};

const printDiscount = (price: number, quantity: number, offerType: SpecialOfferType): string => {
  const catalog: SupermarketCatalog = new FakeCatalog();
  const apples: Product = new Product('apples', ProductUnit.Kilo);
  catalog.addProduct(apples, price);

  const cart: ShoppingCart = new ShoppingCart();
  cart.addItemQuantity(apples, Quantity.of(quantity));

  const teller: Teller = new Teller(catalog);
  teller.addSpecialOffer(offerType, apples, 10.0);

  const receipt: Receipt = teller.checksOutArticlesFrom(cart);

  return print(receipt);
};
const APPLE_PRICE = 1.99;

describe('Supermarket', () => {
  describe('Multiple products', () => {
    it('Should have multiple lines on ticket', () => {
      const catalog: SupermarketCatalog = new FakeCatalog();
      const apples: Product = new Product('apples', ProductUnit.Kilo);
      catalog.addProduct(apples, APPLE_PRICE);

      const cart: ShoppingCart = new ShoppingCart();
      cart.addItemQuantity(apples, Quantity.of(1));
      cart.addItemQuantity(apples, Quantity.of(1));

      const teller: Teller = new Teller(catalog);

      const receipt: Receipt = teller.checksOutArticlesFrom(cart);

      expect(print(receipt)).toBe(`apples                              1.99
apples                              1.99

Total:                              3.98`);
    });
  });

  describe('Two for amount', () => {
    it('More than 2 products', () => {
      const catalog: SupermarketCatalog = new FakeCatalog();
      const apples: Product = new Product('apples', ProductUnit.Kilo);
      catalog.addProduct(apples, APPLE_PRICE);

      const cart: ShoppingCart = new ShoppingCart();
      cart.addItemQuantity(apples, Quantity.of(1));
      cart.addItemQuantity(apples, Quantity.of(1));

      const teller: Teller = new Teller(catalog);
      teller.addSpecialOffer(SpecialOfferType.TwoForAmount, apples, 10.0);

      const receipt: Receipt = teller.checksOutArticlesFrom(cart);

      expect(print(receipt)).toBe(`apples                              1.99
apples                              1.99
2 for 10(apples)                  --6.02

Total:                             10.00`);
    });

    it('Less than 2 products', () => {
      const catalog: SupermarketCatalog = new FakeCatalog();
      const apples: Product = new Product('apples', ProductUnit.Kilo);
      catalog.addProduct(apples, APPLE_PRICE);

      const cart: ShoppingCart = new ShoppingCart();
      cart.addItemQuantity(apples, Quantity.of(1));

      const teller: Teller = new Teller(catalog);
      teller.addSpecialOffer(SpecialOfferType.TwoForAmount, apples, 10.0);

      const receipt: Receipt = teller.checksOutArticlesFrom(cart);

      expect(print(receipt)).toBe(`apples                              1.99

Total:                              1.99`);
    });
  });

  describe('Discount for', () => {
    it('ten percent amount', () => {
      expect(printDiscount(APPLE_PRICE, 2.5, SpecialOfferType.TenPercentDiscount)).toBe(`apples                              4.98
  1.99 * 2.500
10% off(apples)                    -0.50

Total:                              4.48`);
    });
    it('three for two', () => {
      expect(printDiscount(APPLE_PRICE, 3, SpecialOfferType.ThreeForTwo)).toBe(`apples                              5.97
  1.99 * 3.000
3 for 2(apples)                    -1.99

Total:                              3.98`);
    });

    it('five for amount', () => {
      expect(printDiscount(APPLE_PRICE, 5, SpecialOfferType.FiveForAmount)).toBe(`apples                              9.95
  1.99 * 5.000
5 for 10(apples)                  --0.05

Total:                             10.00`);
    });
  });
});
