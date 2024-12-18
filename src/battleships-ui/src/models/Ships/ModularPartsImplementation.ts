import { ShipPartType } from './Ship';
import { ShipClass } from './ShipClass';
import { ModularShipPart } from './ShipPart';
import { createParts } from './Ship';
import { ShipPartsImplementation } from './ShipPartsImplementation';
import { ShipPartsVisitor } from "./visitors/ShipPartsVisitor";
import { ShipPartsNameVisitor } from "./visitors/ShipPartsNameVisitor";
import { ShipPartsColorVisitor } from "./visitors/ShipPartsColorVisitor";
import { ShipPartsVisibilityVisitor } from "./visitors/ShipPartsVisibilityVisitor";

export class ModularPartsImplementation implements ShipPartsImplementation {
     parts: ModularShipPart[] = [];

  constructor(shipClass: ShipClass, amount: number) {
    this.parts = createParts(amount, ShipPartType.Modular, shipClass,
      this.accept(new ShipPartsNameVisitor(), shipClass),  
        this.accept(new ShipPartsColorVisitor(), shipClass),
          parseInt(this.accept(new ShipPartsVisibilityVisitor(), shipClass))) as ModularShipPart[];
  }

  getParts(): ModularShipPart[] {
    return this.parts;
  }

  accept(visitor: ShipPartsVisitor, shipClass: ShipClass): string {
    return visitor.visitModularPartsImplementation(this, shipClass);
  }

  // getPartName(shipClass: ShipClass): string {
  //   switch (shipClass) {
  //     case ShipClass.Carrier:
  //       return "ModularA";
  //     case ShipClass.Battleship:
  //       return "ModularB";
  //     case ShipClass.Cruiser:
  //       return "ModularC";
  //     case ShipClass.Submarine:
  //       return "ModularD";
  //     case ShipClass.Speedboat:
  //       return "ModularE";
  //     default:
  //       throw new Error("Unsupported ShipClass for part name generation");
  //   }
  // }

  // getPartColor(shipClass: ShipClass): string {
  //   switch (shipClass) {
  //     case ShipClass.Carrier:
  //       return "Green";
  //     case ShipClass.Battleship:
  //       return "Black";
  //     case ShipClass.Cruiser:
  //       return "Red";
  //     case ShipClass.Submarine:
  //       return "Red";
  //     case ShipClass.Speedboat:
  //       return "White";
  //     default:
  //       throw new Error("Unsupported ShipClass for colour generation");
  //   }
  // }

  // getPartVisibility(shipClass: ShipClass): number {
  //   switch (shipClass) {
  //     case ShipClass.Carrier:
  //       return 3;
  //     case ShipClass.Battleship:
  //       return 5;
  //     case ShipClass.Cruiser:
  //       return 3;
  //     case ShipClass.Submarine:
  //       return 2;
  //     case ShipClass.Speedboat:
  //       return 1;
  //     default:
  //       throw new Error("Unsupported ShipClass for visibility generation");
  //   }
  // }
}