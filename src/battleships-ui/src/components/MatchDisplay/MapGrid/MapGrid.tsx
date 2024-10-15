import MatchMap, { MapTile } from "../../../models/MatchMap";
import { ModularShipPart } from "../../../models/Ships/ShipPart";
import { TileColor } from "../../../models/Map/TileColors";
import { cn } from "@/lib/utils";

interface MapGridProps {
  isEnemyMap: boolean;
  map: MatchMap;
  selectedTile: MapTile | null;
  title?: string;
  onTileSelect: (tile: MapTile) => void;
}

interface MapGridTileProps {
  tile: MapTile;
  onTileSelect: (tile: MapTile) => void;
  isEnemyMap: boolean;
  isSelected: boolean;
  disableHover: boolean;
}

export default function MapGrid({
  isEnemyMap,
  map,
  selectedTile,
  title,
  onTileSelect,
}: MapGridProps) {
  return (
    <div className="flex flex-col items-center">
      {title && <h4 className="mb-2 text-lg font-semibold">{title}</h4>}
      <div>
        {map.tiles.map((row, idxX) => (
          <div className="flex" key={idxX}>
            {row.map((tile, idxY) => {
              return (
                <MapGridTile
                  isSelected={selectedTile === tile}
                  tile={tile}
                  onTileSelect={onTileSelect}
                  isEnemyMap={isEnemyMap}
                  key={idxY}
                  disableHover={!isEnemyMap}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MapGridTile({
  tile,
  onTileSelect,
  isEnemyMap,
  isSelected,
  disableHover,
}: MapGridTileProps) {
  // let shipPartHpString =
  //   tile.shipPart instanceof ModularShipPart && !isEnemyMap
  //     ? (tile.shipPart as ModularShipPart).hp.toString()
  //     : "";

      let shipPartHpString =
    tile.shipPart !== undefined && (tile.shipPart as ModularShipPart).hp && !isEnemyMap
      ? (tile.shipPart as ModularShipPart).hp.toString()
      : "";

  return (
    <div
      className={cn(
        getColor(tile),
        !disableHover && TileColor.Hover,
        "h-[30px] w-[30px] border-[1px] border-solid",
      )}
      onClick={() => onTileSelect(tile)}
    >
      <span className="map-tile-hp-span flex h-full w-full items-center justify-center">
        {shipPartHpString}
      </span>
    </div>
  );

  function getColor(tile: MapTile): string {
    if (isSelected) {
      return TileColor.Selected;
    }
    if (tile.isShipPartDestroyed) {
      return TileColor.Destroyed;
    }
    if (tile.isAttacked) {
      return tile.shipPart ? TileColor.Damaged : TileColor.Miss;
    }
    if (!isEnemyMap && tile.shipPart) {
      return TileColor.Ship;
    }

    return TileColor.Transparent;
  }
}
