import { ShipClass } from "../ShipClass";
import { ShipPartsVisitor } from "./ShipPartsVisitor";
import { ClassicPartsImplementation } from "../ClassicPartsImplementation";
import { ModularPartsImplementation } from "../ModularPartsImplementation";

export class ShipPartsColorVisitor implements ShipPartsVisitor {
  visitClassicPartsImplementation(
    _implementation: ClassicPartsImplementation,
    shipClass: ShipClass
  ): string {
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

  visitModularPartsImplementation(
    _implementation: ModularPartsImplementation,
    shipClass: ShipClass
  ): string {
    switch (shipClass) {
      case ShipClass.Carrier:
        return "Green";
      case ShipClass.Battleship:
        return "Black";
      case ShipClass.Cruiser:
        return "Red";
      case ShipClass.Submarine:
        return "Red";
      case ShipClass.Speedboat:
        return "White";
      default:
        throw new Error("Unsupported ShipClass for colour generation");
    }
  }
}