import classNames from 'classnames';
import { MapTile } from '../../../models/MatchMap';
import { Player, PlayerTeam } from '../../../models/Player';
import { ModularShipPart } from '../../../models/Ships/ShipPart';

import './MapGrid.css';
import { TileColor } from '../../../models/Map/TileColors';

interface MapGridProps {
  player: Player;
  selectedTile: MapTile | null;
  title?: string;
  onTileSelect: (tile: MapTile) => void;
}

interface MapGridTileProps {
  tile: MapTile;
  onTileSelect: (tile: MapTile) => void;
  isEnemyMap: boolean;
  isSelected: boolean;
}

export default function MapGrid({
  player,
  selectedTile,
  title,
  onTileSelect,
}: MapGridProps) {
  const isEnemyMap = player?.team === PlayerTeam.Enemy;

  return player ? (
    <div className="w-100 d-flex flex-column align-items-center">
      {title && <h4>{title}</h4>}
      <div>
        {player.map.tiles.map((row, idxX) => (
          <div className="map-row" key={idxX}>
            {row.map((tile, idxY) => {
              return (
                <MapGridTile
                  isSelected={selectedTile === tile}
                  tile={tile}
                  onTileSelect={onTileSelect}
                  isEnemyMap={isEnemyMap}
                  key={idxY}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div>Disconnected</div>
  );
}

function MapGridTile({
  tile,
  onTileSelect,
  isEnemyMap,
  isSelected,
}: MapGridTileProps) {
  let shipPartHpString =
    tile.shipPart instanceof ModularShipPart && !isEnemyMap
      ? (tile.shipPart as ModularShipPart).hp.toString()
      : '';

  return (
    <div
      className={classNames('map-tile', getColor(tile))}
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
      return TileColor.Yellow;
    }
    if (!isEnemyMap && tile.shipPart) {
      return TileColor.Blue;
    }

    return TileColor.Transparent;
  }
}
