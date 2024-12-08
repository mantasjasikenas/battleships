import { ShipClass } from "../ShipClass";
import { ModularPartsImplementation } from "../ModularPartsImplementation";
import { ClassicPartsImplementation } from "../ClassicPartsImplementation";
import { ObservingPartsImplementation } from "../ObservingPartsImplementation";

export interface ShipPartsVisitor {
  visitClassicPartsImplementation(
    implementation: ClassicPartsImplementation,
    shipClass: ShipClass
  ): string;

  visitModularPartsImplementation(
    implementation: ModularPartsImplementation,
    shipClass: ShipClass
  ): string;

  visitObservingPartsImplementation(
    implementation: ObservingPartsImplementation,
    shipClass: ShipClass
  ): string;
}