import Vehicle from '../Vehicle';
import Ship from '../Ships/Ship';

export enum AirshipClass {
  Plane,
  Drone,
}

export abstract class Airship extends Vehicle implements Cloneable {
  readonly travelRadius!: number;
  readonly type!: AirshipClass;
  readonly ship!: Ship;
  constructor(ship: Ship) {
    super(ship.positionX, ship.positionY, ship.directionDegrees);
    this.ship = ship;
  }
  clone(): this {
    const objCloneByJsonStringfy = JSON.parse(JSON.stringify(this));
    return objCloneByJsonStringfy;
  }
}

export class Plane extends Airship {
  readonly travelRadius = 7;
  readonly type = AirshipClass.Plane;
}

export class Drone extends Airship {
  readonly travelRadius = 4;
  readonly type = AirshipClass.Drone;
}
interface Cloneable {
  clone(): this;
}
