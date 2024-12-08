import { ShipClass } from "../ShipClass";
import { ShipPartsVisitor } from "./ShipPartsVisitor";
import { ClassicPartsImplementation } from "../ClassicPartsImplementation";
import { ModularPartsImplementation } from "../ModularPartsImplementation";
import { ObservingPartsImplementation } from "../ObservingPartsImplementation";

export class ShipPartsVisibilityVisitor implements ShipPartsVisitor {
  visitClassicPartsImplementation(
    _implementation: ClassicPartsImplementation,
    shipClass: ShipClass
  ): string {
    switch (shipClass) {
      case ShipClass.Carrier:
        return "5";
      case ShipClass.Battleship:
        return "3";
      case ShipClass.Cruiser:
        return "4";
      case ShipClass.Submarine:
        return "5";
      case ShipClass.Speedboat:
        return "3";
      default:
        throw new Error("Unsupported ShipClass for visibility generation");
    }
  }

  visitModularPartsImplementation(
    _implementation: ModularPartsImplementation,
    shipClass: ShipClass
  ): string {
    switch (shipClass) {
      case ShipClass.Carrier:
        return "3";
      case ShipClass.Battleship:
        return "5";
      case ShipClass.Cruiser:
        return "3";
      case ShipClass.Submarine:
        return "2";
      case ShipClass.Speedboat:
        return "1";
      default:
        throw new Error("Unsupported ShipClass for visibility generation");
    }
  }

  visitObservingPartsImplementation(
    _implementation: ObservingPartsImplementation,
    shipClass: ShipClass
  ): string {
    switch (shipClass) {
      case ShipClass.Carrier:
        return "3";
      case ShipClass.Battleship:
        return "5";
      case ShipClass.Cruiser:
        return "3";
      case ShipClass.Submarine:
        return "2";
      case ShipClass.Speedboat:
        return "1";
      default:
        throw new Error("Unsupported ShipClass for visibility generation");
    }
  }
}