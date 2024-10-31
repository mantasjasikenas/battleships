import Ship, {
  Battleship,
  Carrier,
  createParts,
  Cruiser,
  ShipPartType,
  Speedboat,
  Submarine,
} from "./Ship";
import { ShipClass } from "./ShipClass";

export interface IObservingShip extends Ship {
  readonly reconDistance: number;
}

export class ObservingCarrier extends Carrier implements IObservingShip {
  readonly parts = createParts(
    5,
    ShipPartType.Modular,
    ShipClass.Carrier,
    "ObservingA",
    "Red",
    4,
  );
  readonly reconDistance = 7;
}

export class ObservingBattleship extends Battleship implements IObservingShip {
  readonly parts = createParts(
    4,
    ShipPartType.Modular,
    ShipClass.Battleship,
    "ObservingB",
    "Blue",
    5,
  );
  readonly reconDistance = 5;
}

export class ObservingCruiser extends Cruiser implements IObservingShip {
  readonly parts = createParts(
    3,
    ShipPartType.Modular,
    ShipClass.Cruiser,
    "ObservingC",
    "Cyan",
    3,
  );
  readonly reconDistance = 4;
}

export class ObservingSubmarine extends Submarine implements IObservingShip {
  readonly parts = createParts(
    3,
    ShipPartType.Modular,
    ShipClass.Submarine,
    "ObservingD",
    "Green",
    2,
  );
  readonly reconDistance = 4;
}

export class ObservingSpeedboat extends Speedboat implements IObservingShip {
  readonly parts = createParts(
    2,
    ShipPartType.Modular,
    ShipClass.Speedboat,
    "ObservingE",
    "Yellow",
    1,
  );
  readonly reconDistance = 3;
}
