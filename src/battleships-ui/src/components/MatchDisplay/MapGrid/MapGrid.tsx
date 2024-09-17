import classNames from 'classnames';
import MatchMap, { MapTile } from '../../../models/MatchMap';
import { ModularShipPart } from '../../../models/Ships/ShipPart';

import './MapGrid.css';
import { TileColor } from '../../../models/Map/TileColors';

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
    <div className="d-flex flex-column align-items-center">
      {title && <h4>{title}</h4>}
      <div>
        {map.tiles.map((row, idxX) => (
          <div className="map-row" key={idxX}>
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
  let shipPartHpString =
    tile.shipPart instanceof ModularShipPart && !isEnemyMap
      ? (tile.shipPart as ModularShipPart).hp.toString()
      : '';

  return (
    <div
      className={classNames('map-tile', getColor(tile), {
        'map-tile-hover': !disableHover,
      })}
      onClick={() => onTileSelect(tile)}
    >
      <span className="map-tile-hp-span">{shipPartHpString}</span>
    </div>
  );

  function getColor(tile: MapTile): string {
    if (isSelected) {
      return TileColor.Grey;
    }
    if (tile.isShipPartDestroyed) {
      return TileColor.Red;
    }
    if (tile.isAttacked) {
      return tile.shipPart ? TileColor.LightCoral : TileColor.Yellow;
    }
    if (!isEnemyMap && tile.shipPart) {
      return TileColor.Blue;
    }

    return TileColor.Transparent;
  }
}
