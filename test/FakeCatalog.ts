import { Price } from '../src/model/Price';
import { Product } from '../src/model/Product';
import { SupermarketCatalog } from '../src/model/SupermarketCatalog';

export class FakeCatalog implements SupermarketCatalog {
  private products: { [key: string]: Product } = {};
  private prices: { [key: string]: number } = {};

  public addProduct(product: Product, price: number): void {
    this.products[product.name] = product;
    this.prices[product.name] = price;
  }

  public getUnitPrice(p: Product): Price {
    return Price.of(this.prices[p.name]);
  }
}
