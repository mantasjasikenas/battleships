import { ModularPartsImplementation } from './ModularPartsImplementation';
import Ship, {
  Battleship,
  Carrier,
  Cruiser,
  Speedboat,
  Submarine,
} from './Ship';
import { ShipClass } from './ShipClass';

export interface IModularShip extends Ship {}

export class ModularCarrier extends Carrier implements IModularShip {
  constructor() {
    super(new ModularPartsImplementation(ShipClass.Carrier, 5));
  }
}

export class ModularBattleship extends Battleship implements IModularShip {
  constructor() {
    super(new ModularPartsImplementation(ShipClass.Battleship, 4));
  }
}

export class ModularCruiser extends Cruiser implements IModularShip {
  constructor() {
    super(new ModularPartsImplementation(ShipClass.Cruiser, 3));
  }
}

export class ModularSubmarine extends Submarine implements IModularShip {
  constructor() {
    super(new ModularPartsImplementation(ShipClass.Submarine, 3));
  }
}

export class ModularSpeedboat extends Speedboat implements IModularShip {
  constructor() {
    super(new ModularPartsImplementation(ShipClass.Speedboat, 2));
  }
}