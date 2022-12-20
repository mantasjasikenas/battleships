import { TileDecorator } from './TileDecorator';
import { TileColor } from './TileColors';

export class ShipPartTileDecorator extends TileDecorator {
  getColor() {
    return TileColor.Blue;
  }
}
