import { ClassicPartsImplementation } from './ClassicPartsImplementation';
import Ship, {
  Battleship,
  Carrier,
  Cruiser,
  Speedboat,
  Submarine,
} from './Ship';
import { ShipClass } from './ShipClass';

export interface IClassicShip extends Ship {}

export class ClassicCarrier extends Carrier implements IClassicShip {
  constructor() {
    super(new ClassicPartsImplementation(ShipClass.Carrier, 5));
  }
}

export class ClassicBattleship extends Battleship implements IClassicShip {
  constructor() {
    super(new ClassicPartsImplementation(ShipClass.Battleship, 4));
  }
}

export class ClassicCruiser extends Cruiser implements IClassicShip {
  constructor() {
    super(new ClassicPartsImplementation(ShipClass.Cruiser, 3));
  }
}

export class ClassicSubmarine extends Submarine implements IClassicShip {
  constructor() {
    super(new ClassicPartsImplementation(ShipClass.Submarine, 3));
  }
}

export class ClassicSpeedboat extends Speedboat implements IClassicShip {
  constructor() {
    super(new ClassicPartsImplementation(ShipClass.Speedboat, 2));
  }
}