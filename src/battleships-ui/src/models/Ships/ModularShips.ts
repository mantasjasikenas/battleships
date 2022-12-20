import Ship, {
  Battleship,
  Carrier,
  createParts,
  Cruiser,
  ShipPartType,
  Speedboat,
  Submarine,
} from './Ship';
import { ShipClass } from './ShipClass';
import { ModularShipPart } from './ShipPart';

export interface IModularShip extends Ship {
  readonly parts: ModularShipPart[];
}

export class ModularCarrier extends Carrier implements IModularShip {
  readonly parts = createParts(
    5,
    ShipPartType.Modular,
    ShipClass.Carrier
  ) as ModularShipPart[];
}

export class ModularBattleship extends Battleship implements IModularShip {
  readonly parts = createParts(
    4,
    ShipPartType.Modular,
    ShipClass.Battleship
  ) as ModularShipPart[];
}

export class ModularCruiser extends Cruiser implements IModularShip {
  readonly parts = createParts(
    3,
    ShipPartType.Modular,
    ShipClass.Cruiser
  ) as ModularShipPart[];
}

export class ModularSubmarine extends Submarine implements IModularShip {
  readonly parts = createParts(
    3,
    ShipPartType.Modular,
    ShipClass.Submarine
  ) as ModularShipPart[];
}

export class ModularSpeedboat extends Speedboat implements IModularShip {
  readonly parts = createParts(
    2,
    ShipPartType.Modular,
    ShipClass.Speedboat
  ) as ModularShipPart[];
}
