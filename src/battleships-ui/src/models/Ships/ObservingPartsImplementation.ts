import { ShipPartType } from './Ship';
import { ShipClass } from './ShipClass';
import { ShipPart } from './ShipPart';
import { createParts } from './Ship';
import { ShipPartsImplementation } from './ShipPartsImplementation';

export class ObservingPartsImplementation implements ShipPartsImplementation {
  parts: ShipPart[] = [];
  private reconDistance: number;

  constructor(shipClass: ShipClass, amount: number) {
    this.parts = createParts(amount, ShipPartType.Classic, shipClass, this.getPartName(shipClass), this.getPartColor(shipClass), this.getPartVisibility(shipClass));
    this.reconDistance = 10;
  }

  getReconDistance(): number {
    return this.reconDistance;
  }

  getPartName(shipClass: ShipClass): string {
    switch (shipClass) {
      case ShipClass.Carrier:
        return "ObservingA";
      case ShipClass.Battleship:
        return "ObservingB";
      case ShipClass.Cruiser:
        return "ObservingC";
      case ShipClass.Submarine:
        return "ObservingD";
      case ShipClass.Speedboat:
        return "ObservingE";
      default:
        throw new Error("Unsupported ShipClass for part name generation");
    }
  }

  getPartColor(shipClass: ShipClass): string {
    switch (shipClass) {
      case ShipClass.Carrier:
        return "Red";
      case ShipClass.Battleship:
        return "Black";
      case ShipClass.Cruiser:
        return "Green";
      case ShipClass.Submarine:
        return "Yellow";
      case ShipClass.Speedboat:
        return "White";
      default:
        throw new Error("Unsupported ShipClass for colour generation");
    }
  }

  getPartVisibility(shipClass: ShipClass): number {
    switch (shipClass) {
      case ShipClass.Carrier:
        return 5;
      case ShipClass.Battleship:
        return 3;
      case ShipClass.Cruiser:
        return 4;
      case ShipClass.Submarine:
        return 5;
      case ShipClass.Speedboat:
        return 3;
      default:
        throw new Error("Unsupported ShipClass for visibility generation");
    }
  }
}