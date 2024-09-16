import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Ammo } from '../../models/Ammo';
import { Match } from '../../models/Match';
import { MapTile } from '../../models/MatchMap';
import { GameMode } from '../../models/MatchSettings';
import { PlayerTeam } from '../../models/Player';
import { ModularShipPart } from '../../models/Ships/ShipPart';
import {
  AttackHandlerService,
  AttackTurnEventProps,
} from '../../services/AttackHandlerService/AttackHandlerService';
import HubConnectionService, {
  MatchEventNames,
} from '../../services/HubConnectionService/HubConnectionService';
import MatchProvider from '../../services/MatchProvider/MatchProvider';
import AmmoRack from './AmmoRack/AmmoRack';
import MapGrid from './MapGrid/MapGrid';
import { AttackTurn } from '../../models/Turns/AttackTurn';
import { toast } from 'sonner';

export default function MatchDisplay() {
  const [_, setRerenderToggle] = useState(0);
  const [selectedTile, setSelectedTile] = useState<MapTile | null>(null);

  const match = MatchProvider.Instance.match;

  const currentPlayerIdx = match.players[0].team === PlayerTeam.Allies ? 0 : 1;
  const enemyPlayerIdx = Math.abs(currentPlayerIdx - 1);

  const currentPlayer = match.players[currentPlayerIdx];
  const enemyPlayer = match.players[enemyPlayerIdx];

  const [activePlayer, setActivePlayer] = useState(
    match.players.find((player) => player.attackTurns.length > 0)!
  );

  const [selectedAmmo, setSelectedAmmo] = useState<Ammo | null>(null);

  useEffect(() => {
    HubConnectionService.Instance.addSingular(
      MatchEventNames.AttackPerformed,
      handleAttackTurnEvent
    );
  }, []);

  return (
    <div className="container d-flex justify-content-center">
      <div className="col-2">
        <div>
          {currentPlayer?.name} {currentPlayer?.id} {currentPlayer?.team}
        </div>
        <div>
          {currentPlayer?.ships.map((ship, indexShip) => (
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
        <div className="w-100 d-flex justify-content-center gap-2">
          <MapGrid
            player={currentPlayer}
            title="Your map"
            selectedTile={selectedTile}
            onTileSelect={onOwnTileSelect}
          />
          <MapGrid
            title="Enemy map"
            player={enemyPlayer}
            selectedTile={selectedTile}
            onTileSelect={onAttackTurnTargetTileSelect}
          />
        </div>
        <AmmoRack onAmmoSelect={onAmmoSelect} />
        <div className="w-100 mt-3 d-flex justify-content-center">
          <Button
            size="lg"
            disabled={!selectedTile || currentPlayer.attackTurns.length < 1}
            variant="danger"
            onClick={() => onAttack()}
          >
            Attack!
          </Button>
        </div>

        <h3 className="w-100 d-flex justify-content-center mt-3">
          {activePlayer.id === currentPlayer.id
            ? 'Your turn!'
            : activePlayer.name + "'s turn!"}
        </h3>
      </div>
      <div className="col-2">
        <div>
          {enemyPlayer?.name} {enemyPlayer?.id} {enemyPlayer?.team}
        </div>
        <div>
          {enemyPlayer?.ships.map((ship, indexShip) => (
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
    setSelectedAmmo(ammo);

    /* if (currentPlayer.attackTurns.length < 1) {
      toast.error('Sorry, it is not your turn!');
      return;
    } */

    currentPlayer.attackTurns[0].ammo = ammo;
  }

  function onAttackTurnTargetTileSelect(tile: MapTile): void {
    if (currentPlayer.attackTurns.length < 1) {
      toast.error('Sorry, it is not your turn!');
      return;
    }

    const turn = currentPlayer.attackTurns[0];
    setSelectedTile(tile);

    turn.tile = tile;
  }

  function onOwnTileSelect(): void {
    const turn = currentPlayer.attackTurns[0];
    setSelectedTile(null);
    turn.tile = undefined!;
    toast.error('Cannot attack own ships!');
  }

  function onAttack(): void {
    const turn = currentPlayer.attackTurns[0];

    if (!turn.ammo && selectedAmmo) {
      turn.ammo = selectedAmmo;
    }

    if (!turn.tile || !turn.ammo) {
      toast.error('Select ammo and sector to attack first!');

      return;
    }

    HubConnectionService.Instance.sendEvent(MatchEventNames.AttackPerformed, {
      offencePlayerId: currentPlayer.id,
      defencePlayerId: enemyPlayer.id,
      tile: turn.tile,
      ammoType: turn.ammo.type,
    });

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

    // switch active player and update attack turns
    // find next player based on game players order
    const currentPlayerIdx = match.players.findIndex(
      (player) => player.id === offencePlayerId
    );

    const players = match.players;

    // there shold more than 2 players. go to next player based on the  order of players
    const nextPlayerIdx =
      currentPlayerIdx + 1 < players.length ? currentPlayerIdx + 1 : 0;
    const nextPlayer = match.players[nextPlayerIdx];

    // if next player has no attack turns, give him one
    if (nextPlayer.attackTurns.length === 0) {
      nextPlayer.attackTurns.push(new AttackTurn());
    }

    // take turn from current player
    const currentPlayer = match.players[currentPlayerIdx];
    currentPlayer.attackTurns.shift();

    setActivePlayer(nextPlayer);

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
