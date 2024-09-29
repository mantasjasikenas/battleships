import { ShipPart } from './Ships/ShipPart';
import { TileColor } from './Map/TileColors';

export default class MatchMap {
  shipsPlaced: boolean;
  tiles: MapTile[][];

  constructor(sizeX = 10, sizeY = 10) {
    this.tiles = [];
    this.shipsPlaced = false;
    for (let i = 0; i < sizeX; i++) {
      const row: MapTile[] = [];
      this.tiles.push(row);
      for (let j = 0; j < sizeY; j++) {
        row.push(new MapTile(i, j));
      }
    }
  }
}

export class MapTile {
  x: number;
  y: number;

  shipPart?: ShipPart;

  isAttacked = false;
  isShipPartDestroyed = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getColor() {
    return TileColor.Transparent;
  }
}
