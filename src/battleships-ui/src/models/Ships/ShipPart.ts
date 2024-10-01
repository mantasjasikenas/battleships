import { ShipClass } from "./ShipClass";

export abstract class ShipPart {
  constructor(shipClass: ShipClass) {
    this.shipClass = shipClass;
  }

  isDestroyed = false;
  shipClass: ShipClass;
}

export class ClassicShipPart extends ShipPart {}

export class ModularShipPart extends ShipPart {
  readonly initialHp = 10;

  hp = this.initialHp;
}

export class ObservingShipPart extends ShipPart {
  reconDistance!: number;
}
