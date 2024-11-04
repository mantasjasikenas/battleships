import { ObservingPartsImplementation } from "./ObservingPartsImplementation";
import Ship, {
  Battleship,
  Carrier,
  Cruiser,
  Speedboat,
  Submarine,
} from "./Ship";
import { ShipClass } from "./ShipClass";

export interface IObservingShip extends Ship {}

export class ObservingCarrier extends Carrier implements IObservingShip {
  constructor() {
    super(new ObservingPartsImplementation(ShipClass.Carrier, 5));
  }
}

export class ObservingBattleship extends Battleship implements IObservingShip {
  constructor() {
    super(new ObservingPartsImplementation(ShipClass.Battleship, 4));
  }
}

export class ObservingCruiser extends Cruiser implements IObservingShip {
  constructor() {
    super(new ObservingPartsImplementation(ShipClass.Cruiser, 3));
  }
}

export class ObservingSubmarine extends Submarine implements IObservingShip {
  constructor() {
    super(new ObservingPartsImplementation(ShipClass.Submarine, 3));
  }
}

export class ObservingSpeedboat extends Speedboat implements IObservingShip {
  constructor() {
    super(new ObservingPartsImplementation(ShipClass.Speedboat, 2));
  }
}