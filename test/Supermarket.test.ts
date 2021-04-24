import { Discount } from '../src/model/Discount';
import { Product } from '../src/model/Product';
import { ProductUnit } from '../src/model/ProductUnit';
import { Receipt } from '../src/model/Receipt';
import { ShoppingCart } from '../src/model/ShoppingCart';
import { SpecialOfferType } from '../src/model/SpecialOfferType';
import { SupermarketCatalog } from '../src/model/SupermarketCatalog';
import { Teller } from '../src/model/Teller';
import { ReceiptPrinter } from '../src/ReceiptPrinter';

import { FakeCatalog } from './FakeCatalog';

describe('Supermarket', function () {
  it('TODO decide what to specify', function (this: any) {
    const catalog: SupermarketCatalog = new FakeCatalog();
    const toothbrush: Product = new Product('toothbrush', ProductUnit.Each);
    catalog.addProduct(toothbrush, 0.99);
    const apples: Product = new Product('apples', ProductUnit.Kilo);
    catalog.addProduct(apples, 1.99);

    const cart: ShoppingCart = new ShoppingCart();
    cart.addItemQuantity(apples, 2.5);

    const teller: Teller = new Teller(catalog);
    teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, toothbrush, 10.0);
    teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apples, 10.0);

    const receipt: Receipt = teller.checksOutArticlesFrom(cart);

    const receiptPrinter = new ReceiptPrinter();

    const printed = receiptPrinter.printReceipt(receipt);

    expect(printed).toBe(
      `apples                              4.98
  1.99 * 2.500
10% off(apples)                    -0.50

Total:                              4.48`
    );
  });
});
