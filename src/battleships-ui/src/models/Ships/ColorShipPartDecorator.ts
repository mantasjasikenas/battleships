import { ShipPart } from "./ShipPart";
import { ShipPartDecorator } from "./ShipPartDecorator";

export class ColorShipPartDecorator extends ShipPartDecorator {
  private shipPartColor: string;

  constructor(decoratedShipPart: ShipPart, color: string) {
    super(decoratedShipPart);
    this.shipPartColor = color;
  }

  getPartColor(): string {
    return this.shipPartColor;
  }
}
