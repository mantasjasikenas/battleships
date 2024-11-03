import { ShipPart } from "./ShipPart";

// DESIGN PATTERN: 8. Decorator
export abstract class ShipPartDecorator extends ShipPart {
  protected decoratedShipPart: ShipPart;

  constructor(decoratedShipPart: ShipPart) {
    super(decoratedShipPart.shipClass, decoratedShipPart);
    this.decoratedShipPart = decoratedShipPart;
  }

  public shalowCopy(): ShipPart {
    return this.decoratedShipPart.shalowCopy();
  }

  public deepCopy(): ShipPart {
    return this.decoratedShipPart.deepCopy();
  }
}
