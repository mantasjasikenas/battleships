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

export interface IClassicShip extends Ship {}

export class ClassicCarrier extends Carrier implements IClassicShip {
  readonly parts = createParts(5, ShipPartType.Classic, ShipClass.Carrier, "A", "Red", 5);
}

export class ClassicBattleship extends Battleship implements IClassicShip {
  readonly parts = createParts(4, ShipPartType.Classic, ShipClass.Battleship, "B", "Black", 3);
}

export class ClassicCruiser extends Cruiser implements IClassicShip {
  readonly parts = createParts(3, ShipPartType.Classic, ShipClass.Cruiser, "C", "Green", 4);
}

export class ClassicSubmarine extends Submarine implements IClassicShip {
  readonly parts = createParts(3, ShipPartType.Classic, ShipClass.Submarine, "D", "Yellow", 5);
}

export class ClassicSpeedboat extends Speedboat implements IClassicShip {
  readonly parts = createParts(2, ShipPartType.Classic, ShipClass.Speedboat, "E", "White", 3);
}