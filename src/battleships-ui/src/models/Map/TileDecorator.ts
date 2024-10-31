import { MapTile } from "../MatchMap";
import { TileColor } from "./TileColors";

export abstract class TileDecorator implements MapTile {
  isAttacked: boolean;
  isShipPartDestroyed: boolean;
  x: number;
  y: number;

  constructor(tile: MapTile) {
    this.isAttacked = tile.isAttacked;
    this.isShipPartDestroyed = tile.isShipPartDestroyed;
    this.x = tile.x;
    this.y = tile.y;
  }

  abstract getColor(): TileColor;

  copy() {
    return new MapTile(undefined, undefined, this);
  }
}
