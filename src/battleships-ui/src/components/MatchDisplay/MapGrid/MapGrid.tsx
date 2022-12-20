import classNames from 'classnames';
import { MapTile } from '../../../models/MatchMap';
import { Player, PlayerTeam } from '../../../models/Player';
import { ModularShipPart } from '../../../models/Ships/ShipPart';

import './MapGrid.css';
import { SelectedTileDecorator } from '../../../models/Map/SelectedTileDecorator';
import { DestroyedTileDecorator } from '../../../models/Map/DestroyedTileDecorator';
import { ShipPartTileDecorator } from '../../../models/Map/ShipPartTileDecorator';
import { AttackedTileDecorator } from '../../../models/Map/AttackedTileDecorator';
import { TileColor } from '../../../models/Map/TileColors';

interface MapGridProps {
  player: Player;
  selectedTile: MapTile | null;
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
  onTileSelect,
}: MapGridProps) {
  const isEnemyMap = player?.team == PlayerTeam.Red;

  return player ? (
    <div className="w-100 d-flex justify-content-center">
      <div>
        {player.map.tiles.map((row, idxX) => (
          <div className="map-row" key={idxX}>
            {row.map((tile, idxY) => {
              return (
                <MapGridTile
                  isSelected={selectedTile == tile}
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
