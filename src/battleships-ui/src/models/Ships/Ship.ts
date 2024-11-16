import Vehicle from '../Vehicle';
import { ColorShipPartDecorator } from './ColorShipPartDecorator';
import { NamingShipPartDecorator } from './NamingShipPartDecorator';
import { ShipClass } from './ShipClass';
import {
  ClassicShipPart,
  ModularShipPart,
  // ObservingShipPart,
  ShipPart,
} from './ShipPart';
import { ShipPartsImplementation } from './ShipPartsImplementation';
import { VisibilityShipPartDecorator } from './VisibilityShipPartDecorator';

export enum ShipPartType {
  Classic,
  Modular,
  // Observing,
}

export default abstract class Ship extends Vehicle {
  public partsImplementation: ShipPartsImplementation;

  constructor(partsImplementation: ShipPartsImplementation) {
    super();
    this.partsImplementation = partsImplementation;
  }
}

export abstract class Carrier extends Ship {
  readonly shipClass = ShipClass.Carrier;
}

export abstract class Battleship extends Ship {
  readonly shipClass = ShipClass.Battleship;
}

export abstract class Cruiser extends Ship {
  readonly shipClass = ShipClass.Cruiser;
}

export abstract class Submarine extends Ship {
  readonly shipClass = ShipClass.Submarine;
}

export abstract class Speedboat extends Ship {
  readonly shipClass = ShipClass.Speedboat;
}

export function createParts(
  amount: number,
  type: ShipPartType,
  shipClass: ShipClass,
  shipPartName: string,
  shipPartColor: string,
  shipPartVisibility: number
): ShipPart[] {
  const result: ShipPart[] = [];
  
  const basePart = createPart(type, shipClass);

  // push the first part and create shallow copies with re-decoration for each part
  result.push(redecorateShipPart(basePart, shipPartName + 1, shipPartColor, shipPartVisibility));
  for (let i = 1; i < amount; i++) {
    const copiedPart = basePart.shalowCopy();
    result.push(redecorateShipPart(copiedPart, shipPartName + (i + 1), shipPartColor, shipPartVisibility));
  }
  
  return result;
}

function redecorateShipPart(part: ShipPart, name: string, color: string, visibility: number): ShipPart {
  // return part;
  const namedPart = new NamingShipPartDecorator(part, name);
  const coloredPart = new ColorShipPartDecorator(namedPart, color);
  return new VisibilityShipPartDecorator(coloredPart, visibility);
}

export function createPart(type: ShipPartType, shipClass: ShipClass) {
  switch (type) {
    case ShipPartType.Classic: {
      return new ClassicShipPart(shipClass);
    }
    case ShipPartType.Modular: {
      return new ModularShipPart(shipClass);
    }
    // case ShipPartType.Observing: {
    //   return new ObservingShipPart(shipClass);
    // }
  }
}
