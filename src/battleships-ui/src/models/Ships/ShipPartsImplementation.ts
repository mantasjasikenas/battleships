import { ShipClass } from "./ShipClass";
import { ShipPart } from "./ShipPart";

// DESIGN PATTERN: 12. Bridge
export interface ShipPartsImplementation {
    getPartName(shipClass: ShipClass): string;
    getPartColor(shipClass: ShipClass): string;
    getPartVisibility(shipClass: ShipClass): number;
    parts: ShipPart[];
  }
  