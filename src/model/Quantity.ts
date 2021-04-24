export class Quantity {
  private constructor(private readonly quantity: number) {}

  get(): number {
    return this.quantity;
  }

  static of(quantity: number): Quantity {
    return new Quantity(quantity);
  }

  add(added: Quantity): Quantity {
    return Quantity.of(this.quantity + added.quantity);
  }
}
