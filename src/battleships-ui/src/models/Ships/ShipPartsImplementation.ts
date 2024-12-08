import { ShipClass } from "./ShipClass";
import { ShipPart } from "./ShipPart";
import { ShipPartsVisitor } from "./visitors/ShipPartsVisitor";

// DESIGN PATTERN: 12. Bridge
export interface ShipPartsImplementation {
    // getPartName(shipClass: ShipClass): string;
    // getPartColor(shipClass: ShipClass): string;
    // getPartVisibility(shipClass: ShipClass): number;
    accept(visitor: ShipPartsVisitor, shipClass: ShipClass): string;

    parts: ShipPart[];
  }
  