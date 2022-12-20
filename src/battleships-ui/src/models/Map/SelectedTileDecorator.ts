import { TileDecorator } from './TileDecorator';
import { TileColor } from './TileColors';

export class SelectedTileDecorator extends TileDecorator {
  getColor() {
    return TileColor.Grey;
  }
}
