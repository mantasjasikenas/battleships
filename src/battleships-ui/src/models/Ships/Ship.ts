import Vehicle from '../Vehicle';
import { ShipClass } from './ShipClass';
import {
  ClassicShipPart,
  ModularShipPart,
  // ObservingShipPart,
  ShipPart,
} from './ShipPart';

export enum ShipPartType {
  Classic,
  Modular,
  Observing,
}

export default abstract class Ship extends Vehicle {
  readonly forwardTravelDistance = 1;
  readonly shipClass!: ShipClass;
  readonly parts!: ShipPart[];
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
  shipClass: ShipClass
): ShipPart[] {
  const result: ShipPart[] = [];
  result.push(createPart(type, shipClass));
  for (let i = 1; i < amount; i++) {
    result.push(result[0].shalowCopy());
  }
  return result;
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
