import { ShipPart } from "./ShipPart";
import { ShipPartDecorator } from "./ShipPartDecorator";

export class NamingShipPartDecorator extends ShipPartDecorator {
    private shipPartName: string;
  
    constructor(decoratedShipPart: ShipPart, name: string) {
      super(decoratedShipPart);
      this.shipPartName = name;
      //this.logDecoration();
    }
  
    getPartName(): string {
      return this.shipPartName;
    }

    logDecoration() {
      console.log(`ShipPart "${this.decoratedShipPart.shipClass}" is being decorated with the name "${this.getPartName()}".`);
  }
}