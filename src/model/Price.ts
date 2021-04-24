import { Quantity } from './Quantity';

export class Price {
  private constructor(private readonly price: number) {}

  static of(price: number): Price {
    return new Price(price);
  }

  get(): number {
    return this.price;
  }

  multiply(quantity: Quantity): Price {
    return Price.of(this.price * quantity.get());
  }

  add(added: Price): Price {
    return Price.of(this.price + added.price);
  }

  substract(substracted: Price): Price {
    return Price.of(this.price - substracted.price);
  }
}
