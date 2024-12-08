import { ShipClass } from "../ShipClass";
import { ModularPartsImplementation } from "../ModularPartsImplementation";
import { ClassicPartsImplementation } from "../ClassicPartsImplementation";

export interface ShipPartsVisitor {
  visitClassicPartsImplementation(
    implementation: ClassicPartsImplementation,
    shipClass: ShipClass
  ): string;

  visitModularPartsImplementation(
    implementation: ModularPartsImplementation,
    shipClass: ShipClass
  ): string;
}