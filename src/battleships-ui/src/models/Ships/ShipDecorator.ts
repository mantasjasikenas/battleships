import Ship from './Ship';
import { ShipPart } from './ShipPart'

export abstract class ShipDecorator<T extends Ship> extends Ship {
    protected decoratedShip: T;

    constructor(ship: T) {
        super();
        this.decoratedShip = ship;
    }

    get parts(): ShipPart[] {
        return this.decoratedShip.parts || []; // Fallback to an empty array if parts is undefined
    }

}