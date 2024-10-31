import { ModularShipPart, ShipPart } from "./Ships/ShipPart";
import { TileColor } from "./Map/TileColors";

export default class MatchMap {
  shipsPlaced: boolean;
  tiles: MapTile[][];

  constructor(map?: MatchMap, sizeX = 10, sizeY = 10) {
    if (map?.tiles) {
      this.shipsPlaced = map.shipsPlaced;
      this.tiles = [];
      for (let i = 0; i < sizeX; i++) {
        const row: MapTile[] = [];

        this.tiles.push(row);

        for (let j = 0; j < sizeY; j++) {
          row.push(map.tiles[i][j].copy());
        }
      }
    } else {
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

  copy() {
    return new MatchMap(this);
  }
}

export class MapTile {
  x: number;
  y: number;

  shipPart?: ShipPart;

  isAttacked = false;
  isShipPartDestroyed = false;

  constructor(x?: number, y?: number, tile?: MapTile) {
    if (tile) {
      this.x = tile.x;
      this.y = tile.y;
      if (
        tile.shipPart &&
        (tile.shipPart as ModularShipPart).hp !== undefined
      ) {
        this.shipPart = new ModularShipPart(
          undefined,
          tile.shipPart as ModularShipPart,
        );
      } else {
        this.shipPart = tile.shipPart;
      }
      this.isAttacked = tile.isAttacked;
      this.isShipPartDestroyed = tile.isShipPartDestroyed;
    } else if (y !== undefined && x !== undefined) {
      this.x = x;
      this.y = y;
    } else {
      this.x = -1;
      this.y = -1;
    }
  }

  getColor() {
    return TileColor.Transparent;
  }

  copy() {
    return new MapTile(undefined, undefined, this);
  }
}
