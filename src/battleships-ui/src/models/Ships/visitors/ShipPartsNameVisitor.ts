import { ShipClass } from "../ShipClass";
import { ShipPartsVisitor } from "./ShipPartsVisitor";
import { ClassicPartsImplementation } from "../ClassicPartsImplementation";
import { ModularPartsImplementation } from "../ModularPartsImplementation";
import { ObservingPartsImplementation } from "../ObservingPartsImplementation";

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

  visitObservingPartsImplementation(
    _implementation: ObservingPartsImplementation,
    shipClass: ShipClass
  ): string {
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
}