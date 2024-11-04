import MatchMap, { MapTile } from "../../../models/MatchMap";
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
  //   tile.shipPart !== undefined && (tile.shipPart as ModularShipPart).hp && !isEnemyMap
  //     ? (tile.shipPart as ModularShipPart).hp.toString()
  //     : "";

  const shipPartText = getShipPartText(tile);
  const shipPartVisibility = getShipPartVisibility(tile);
  const shipPartColor = getShipPartColor(tile);
  const shipPartHpString = getShipPartHp(tile);
  let displayText;

  if (shipPartHpString) {
    displayText = shipPartHpString;
  } else {
    const visibilityText = shipPartVisibility ? "V" : "";
    const colorText = shipPartColor ? "C" : "";
    const textText = shipPartText ? "T" : "";

    displayText = visibilityText + colorText + textText;

    // if(displayText != ""){
    //    console.log(visibilityText + colorText + textText);
    // }
  }

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
        {displayText}
      </span>
    </div>
  );

  function getShipPartText(tile: MapTile): string {
    let currentPart = tile.shipPart;

    while (currentPart) {
      if ("shipPartName" in currentPart && !isEnemyMap) {
        return (currentPart as any).shipPartName;
      }
      // move to the next decorated layer
      currentPart = (currentPart as any).decoratedShipPart;
    }

    return "";
  }

  function getShipPartVisibility(tile: MapTile): string {
    let currentPart = tile.shipPart;

    while (currentPart) {
      if ("visibilityLevel" in currentPart && !isEnemyMap) {
        return (currentPart as any).visibilityLevel;
      }
      // move to the next decorated layer
      currentPart = (currentPart as any).decoratedShipPart;
    }

    return "";
  }

  function getShipPartColor(tile: MapTile): string {
    let currentPart = tile.shipPart;

    while (currentPart) {
      if ("shipPartColor" in currentPart && !isEnemyMap) {
        return (currentPart as any).shipPartColor;
      }
      // move to the next decorated layer
      currentPart = (currentPart as any).decoratedShipPart;
    }

    return "";
  }

  function getShipPartHp(tile: MapTile): string {
    let currentPart = tile.shipPart;

    while (currentPart) {
      if ("hp" in currentPart && !isEnemyMap && tile.shipPart !== undefined ) {
        return (currentPart as any).hp.toString();
      }
      // move to the next decorated layer
      currentPart = (currentPart as any).decoratedShipPart;
    }

    return "";
  }

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
