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
  readonly parts = createParts(5, ShipPartType.Classic, ShipClass.Carrier);
}

export class ClassicBattleship extends Battleship implements IClassicShip {
  readonly parts = createParts(4, ShipPartType.Classic, ShipClass.Battleship);
}

export class ClassicCruiser extends Cruiser implements IClassicShip {
  readonly parts = createParts(3, ShipPartType.Classic, ShipClass.Cruiser);
}

export class ClassicSubmarine extends Submarine implements IClassicShip {
  readonly parts = createParts(3, ShipPartType.Classic, ShipClass.Submarine);
}

export class ClassicSpeedboat extends Speedboat implements IClassicShip {
  readonly parts = createParts(2, ShipPartType.Classic, ShipClass.Speedboat);
}
