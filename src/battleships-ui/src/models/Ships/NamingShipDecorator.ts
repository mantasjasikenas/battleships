import { ShipDecorator } from './ShipDecorator';
import Ship from './Ship';

export class NamingShipDecorator<T extends Ship> extends ShipDecorator<T> {
  private shipName: string;

  constructor(decoratedShip: T, name: string) {
    super(decoratedShip); // This calls ShipDecorator's constructor, which handles parts
    this.shipName = name;
  }

  getName(): string {
    return this.shipName;
  }
}