import { ShipClass } from "./ShipClass";

// DESIGN PATTERN: 7. Prototype
export abstract class ShipPart {
  constructor(shipClass?: ShipClass, part?: ShipPart) {
    if (part) {
      this.isDestroyed = part.isDestroyed;
      this.shipClass = part.shipClass;
    }
    if (shipClass !== undefined) {
      this.shipClass = shipClass;
    }
  }

  isDestroyed = false;
  shipClass: ShipClass | undefined;

  public abstract shalowCopy(): ShipPart;
  public abstract deepCopy(): ShipPart;
}

export class ClassicShipPart extends ShipPart {
  public shalowCopy(): ShipPart {
    return this;
  }
  public deepCopy(): ShipPart {
    return new ClassicShipPart(undefined, this);
  }
}

export class ModularShipPart extends ShipPart {
  constructor(shipClass?: ShipClass, part?: ModularShipPart) {
    super(shipClass, part);
    if (part) {
      this.initialHp = part.initialHp;
      this.hp = part.hp;
    }
  }
  public shalowCopy(): ShipPart {
    return this;
  }
  public deepCopy(): ShipPart {
    return new ModularShipPart(undefined, this);
  }
  readonly initialHp = 10;

  hp = this.initialHp;
}

// export class ObservingShipPart extends ShipPart {
//   reconDistance!: number;
// }
