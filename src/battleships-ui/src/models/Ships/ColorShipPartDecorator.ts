import { ShipPart } from "./ShipPart";
import { ShipPartDecorator } from "./ShipPartDecorator";

export class ColorShipPartDecorator extends ShipPartDecorator {
  private shipPartColor: string;

  constructor(decoratedShipPart: ShipPart, color: string) {
    super(decoratedShipPart);
    this.shipPartColor = color;
    //this.logDecoration();
  }

  getPartColor(): string {
    return this.shipPartColor;
  }

  logDecoration() {
    console.log(`ShipPart "${this.decoratedShipPart.shipClass}" is being decorated with the color "${this.getPartColor()}".`);
  }
}
