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

export interface IObservingShip extends Ship {
  readonly reconDistance: number;
}

export class ObservingCarrier extends Carrier implements IObservingShip {
  readonly parts = createParts(5, ShipPartType.Observing, ShipClass.Carrier);
  readonly reconDistance = 7;
}

export class ObservingBattleship extends Battleship implements IObservingShip {
  readonly parts = createParts(4, ShipPartType.Observing, ShipClass.Battleship);
  readonly reconDistance = 5;
}

export class ObservingCruiser extends Cruiser implements IObservingShip {
  readonly parts = createParts(3, ShipPartType.Observing, ShipClass.Cruiser);
  readonly reconDistance = 4;
}

export class ObservingSubmarine extends Submarine implements IObservingShip {
  readonly parts = createParts(3, ShipPartType.Observing, ShipClass.Submarine);
  readonly reconDistance = 4;
}

export class ObservingSpeedboat extends Speedboat implements IObservingShip {
  readonly parts = createParts(2, ShipPartType.Observing, ShipClass.Speedboat);
  readonly reconDistance = 3;
}
