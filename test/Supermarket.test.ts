import { Product } from '../src/model/Product';
import { ProductUnit } from '../src/model/ProductUnit';
import { Receipt } from '../src/model/Receipt';
import { ShoppingCart } from '../src/model/ShoppingCart';
import { SpecialOfferType } from '../src/model/SpecialOfferType';
import { SupermarketCatalog } from '../src/model/SupermarketCatalog';
import { Teller } from '../src/model/Teller';

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

    const receipt: Receipt = teller.checksOutArticlesFrom(cart);

    // Todo: complete this test
    expect(receipt).toEqual({
      discounts: [],
      items: [{ price: 1.99, product: { name: 'apples', unit: 0 }, quantity: 2.5, totalPrice: 4.975 }],
    });
  });
});
