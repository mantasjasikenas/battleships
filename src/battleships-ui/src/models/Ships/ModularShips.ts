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
    ShipClass.Carrier,
    "ModularA",
    "Red",
    4
  ) as ModularShipPart[];
}

export class ModularBattleship extends Battleship implements IModularShip {
  readonly parts = createParts(
    4,
    ShipPartType.Modular,
    ShipClass.Battleship,
    "ModularB",
    "Blue",
    5
  ) as ModularShipPart[];
}

export class ModularCruiser extends Cruiser implements IModularShip {
  readonly parts = createParts(
    3,
    ShipPartType.Modular,
    ShipClass.Cruiser,
    "ModularC",
    "Cyan",
    3
  ) as ModularShipPart[];
}

export class ModularSubmarine extends Submarine implements IModularShip {
  readonly parts = createParts(
    3,
    ShipPartType.Modular,
    ShipClass.Submarine,
    "ModularD",
    "Green",
    2
  ) as ModularShipPart[];
}

export class ModularSpeedboat extends Speedboat implements IModularShip {
  readonly parts = createParts(
    2,
    ShipPartType.Modular,
    ShipClass.Speedboat,
    "ModularE",
    "Magenta",
    5
  ) as ModularShipPart[];
}
