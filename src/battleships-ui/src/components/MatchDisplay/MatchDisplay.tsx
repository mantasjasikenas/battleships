import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Ammo, AmmoType } from '../../models/Ammo';
import { Match } from '../../models/Match';
import MatchMap, { MapTile } from '../../models/MatchMap';
import { GameMode } from '../../models/MatchSettings';
import { PlayerTeam } from '../../models/Player';
import { ShipClass } from '../../models/Ships/ShipClass';
import { ModularShipPart } from '../../models/Ships/ShipPart';
import {
  AttackHandlerService,
  AttackTurnEventProps,
} from '../../services/AttackHandlerService/AttackHandlerService';
import ConnectionMediatorService, {
  MatchEventNames,
} from '../../services/ConnectionMediatorService/ConnectionMediatorService';
import MatchProvider from '../../services/MatchProvider/MatchProvider';
import AmmoRack from './AmmoRack/AmmoRack';
import MapGrid from './MapGrid/MapGrid';

export default function MatchDisplay() {
  const [_, setRerenderToggle] = useState(0);
  const [selectedTile, setSelectedTile] = useState<MapTile | null>(null);

  const match = MatchProvider.Instance.match;
  const bluePlayerIdx = match.players[0].team === PlayerTeam.Blue ? 0 : 1;
  const redPlayerIdx = Math.abs(bluePlayerIdx - 1);
  const bluePlayer = match.players[bluePlayerIdx];
  const redPlayer = match.players[redPlayerIdx];

  useEffect(() => {
    ConnectionMediatorService.Instance.addSingular(
      MatchEventNames.AttackPerformed,
      handleAttackTurnEvent
    );
  }, []);

  return (
    <div className="container d-flex justify-content-center">
      <div className="col-2">
        <div>
          {bluePlayer?.name} {bluePlayer?.id} {bluePlayer?.team}
        </div>
        <div>
          {bluePlayer?.ships.map((ship, indexShip) => (
            <div key={indexShip}>
              <span>{ship.constructor.name}</span>
              <br />
              {ship.parts.map((part, indexPart) => (
                <span key={`${indexShip}-${indexPart}`}>
                  {match.settings.gameMode === GameMode.Ammo
                    ? (part as ModularShipPart).hp
                    : 1}{' '}
                </span>
              ))}
              <br />
            </div>
          ))}
        </div>
      </div>
      <div className="col-8">
        <div className="w-100 d-flex  justify-content-center">{match.name}</div>
        <div className="w-100 d-flex justify-content-center">
          <MapGrid
            player={bluePlayer}
            selectedTile={selectedTile}
            onTileSelect={onOwnTileSelect}
          />
          <MapGrid
            player={redPlayer}
            selectedTile={selectedTile}
            onTileSelect={onAttackTurnTargetTileSelect}
          />
        </div>
        <AmmoRack onAmmoSelect={onAmmoSelect} />
        <div className="w-100 mt-3 d-flex justify-content-center">
          <Button
            size="lg"
            disabled={!selectedTile || bluePlayer.attackTurns.length < 1}
            variant="danger"
            onClick={() => onAttack()}
          >
            Attack!
          </Button>
        </div>
      </div>
      <div className="col-2">
        <div>
          {redPlayer?.name} {redPlayer?.id} {redPlayer?.team}
        </div>
        <div>
          {redPlayer?.ships.map((ship, indexShip) => (
            <div key={indexShip}>
              <span>{ship.constructor.name}</span>
              <br />
              {ship.parts.map((part, indexPart) => (
                <span key={`${indexShip}-${indexPart}`}>
                  {match.settings.gameMode === GameMode.Ammo ? 10 : 1}{' '}
                </span>
              ))}
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function onAmmoSelect(ammo: Ammo): void {
    if (bluePlayer.attackTurns.length < 1) {
      console.error('No attack turns left!');
      return;
    }

    bluePlayer.attackTurns[0].ammo = ammo;
  }

  function onAttackTurnTargetTileSelect(tile: MapTile): void {
    if (bluePlayer.attackTurns.length < 1) {
      console.error('No attack turns left!');
      return;
    }

    const turn = bluePlayer.attackTurns[0];
    setSelectedTile(tile);

    turn.tile = tile;
  }

  function onOwnTileSelect(): void {
    const turn = bluePlayer.attackTurns[0];
    setSelectedTile(null);
    turn.tile = undefined!;
    console.error('Cannot attack own ships!');
  }

  function onAttack(): void {
    const turn = bluePlayer.attackTurns[0];

    if (!turn.tile || !turn.ammo) {
      console.error('Select ammo and sector to attack first!');

      return;
    }

    ConnectionMediatorService.Instance.sendEvent(
      MatchEventNames.AttackPerformed,
      {
        offencePlayerId: bluePlayer.id,
        defencePlayerId: redPlayer.id,
        tile: turn.tile,
        ammoType: turn.ammo.type,
      }
    );

    setSelectedTile(null);
  }

  function handleAttackTurnEvent(data: any): void {
    const { offencePlayerId, defencePlayerId, tile, ammoType } =
      data as AttackTurnEventProps;

    const defencePlayer = MatchProvider.getPlayer(defencePlayerId);

    const mapTile = defencePlayer!.map.tiles[tile.x][tile.y];

    const attackFunc = AttackHandlerService.getAttackByAmmo(
      ammoType,
      match.availableAmmoTypes
    );

    attackFunc(mapTile, defencePlayer!.map);

    rerender();
  }

  function rerender(): void {
    setRerenderToggle(Math.random() * 100);
  }
}

export function matchLoader(): Match {
  const match = MatchProvider.Instance.match;

  return match;
}
