import { ShipPart } from "./ShipPart";
import { ShipPartDecorator } from "./ShipPartDecorator";

export class NamingShipPartDecorator extends ShipPartDecorator {
    private shipPartName: string;
  
    constructor(decoratedShipPart: ShipPart, name: string) {
      super(decoratedShipPart);
      this.shipPartName = name;
    }
  
    getPartName(): string {
      return this.shipPartName;
    } 
}