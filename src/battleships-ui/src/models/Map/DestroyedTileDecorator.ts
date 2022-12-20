import { TileDecorator } from './TileDecorator';
import { TileColor } from './TileColors';

export class DestroyedTileDecorator extends TileDecorator {
  getColor() {
    return TileColor.Red;
  }
}
