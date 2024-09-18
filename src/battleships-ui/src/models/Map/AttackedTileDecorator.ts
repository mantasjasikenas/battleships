import { TileDecorator } from "./TileDecorator";
import { TileColor } from "./TileColors";

export class AttackedTileDecorator extends TileDecorator {
  getColor() {
    return TileColor.Miss;
  }
}
