import { ShipPart } from "./ShipPart";
import { ShipPartDecorator } from "./ShipPartDecorator";

export class VisibilityShipPartDecorator extends ShipPartDecorator {
  private visibilityLevel: number;

  constructor(decoratedShipPart: ShipPart, visibilityLevel: number) {
    super(decoratedShipPart);
    this.visibilityLevel = visibilityLevel;
    //this.logDecoration();
  }

  getVisibilityLevel(): number {
    return this.visibilityLevel;
  }

  increaseVisibility(amount: number): void {
    this.visibilityLevel += amount;
  }

  decreaseVisibility(amount: number): void {
    this.visibilityLevel = Math.max(0, this.visibilityLevel - amount);
  }

  logDecoration() {
    console.log(`ShipPart "${this.decoratedShipPart.shipClass}" is being decorated with the visibility level "${this.getVisibilityLevel()}".`);
  }
}
