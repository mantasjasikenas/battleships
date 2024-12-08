import { ShipClass } from "../ShipClass";
import { ShipPartsVisitor } from "./ShipPartsVisitor";
import { ClassicPartsImplementation } from "../ClassicPartsImplementation";
import { ModularPartsImplementation } from "../ModularPartsImplementation";

export class ShipPartsNameVisitor implements ShipPartsVisitor {
  visitClassicPartsImplementation(
    _implementation: ClassicPartsImplementation,
    shipClass: ShipClass
  ): string {
    switch (shipClass) {
      case ShipClass.Carrier:
        return "ClassicA";
      case ShipClass.Battleship:
        return "ClassicB";
      case ShipClass.Cruiser:
        return "ClassicC";
      case ShipClass.Submarine:
        return "ClassicD";
      case ShipClass.Speedboat:
        return "ClassicE";
      default:
        throw new Error("Unsupported ShipClass for part name generation");
    }
  }

  visitModularPartsImplementation(
    _implementation: ModularPartsImplementation,
    shipClass: ShipClass
  ): string {
    switch (shipClass) {
      case ShipClass.Carrier:
        return "ModularA";
      case ShipClass.Battleship:
        return "ModularB";
      case ShipClass.Cruiser:
        return "ModularC";
      case ShipClass.Submarine:
        return "ModularD";
      case ShipClass.Speedboat:
        return "ModularE";
      default:
        throw new Error("Unsupported ShipClass for part name generation");
    }
  }
}