import { Offer } from './Offer';
import { Product } from './Product';
import { Receipt } from './Receipt';
import { OffersByProduct, ShoppingCart } from './ShoppingCart';
import { SpecialOfferType } from './SpecialOfferType';
import { SupermarketCatalog } from './SupermarketCatalog';

export class Teller {
  private offers: OffersByProduct = {};

  public constructor(private readonly catalog: SupermarketCatalog) {}

  public addSpecialOffer(offerType: SpecialOfferType, product: Product, argument: number): void {
    this.offers[product.name] = new Offer(offerType, product, argument);
  }

  public checksOutArticlesFrom(theCart: ShoppingCart): Receipt {
    const receipt = new Receipt();
    const productQuantities = theCart.getItems();
    for (const pq of productQuantities) {
      const p = pq.product;
      const quantity = pq.quantity;
      const unitPrice = this.catalog.getUnitPrice(p);
      const price = quantity * unitPrice;
      receipt.addProduct(p, quantity, unitPrice, price);
    }
    theCart.handleOffers(receipt, this.offers, this.catalog);

    return receipt;
  }
}
