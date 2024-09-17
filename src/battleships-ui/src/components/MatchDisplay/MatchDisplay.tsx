import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Ammo } from '../../models/Ammo';
import { MapTile } from '../../models/MatchMap';
import { PlayerTeam } from '../../models/Player';
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
import { PlayerService } from '../../services/PlayerService/PlayerService';

export default function MatchDisplay() {
  const [_, setRerenderToggle] = useState(0);
  const [selectedTile, setSelectedTile] = useState<MapTile | null>(null);

  const match = MatchProvider.Instance.match;
  const currentPlayerId = PlayerService.getFromSessionStorage()!!.id;
  const currentPlayer = match.players.find(
    (player) => player.id === currentPlayerId
  )!;

  const currentPlayerTeam = currentPlayer.team;

  const alliesTeamPlayers = match.players.filter(
    (player) => player.team === currentPlayerTeam
  );
  const enemiesTeamPlayers = match.players.filter(
    (player) => player.team !== currentPlayerTeam
  );

  const enemiesTeamMap = match.teamsMap.get(
    currentPlayerTeam === PlayerTeam.FirstTeam
      ? PlayerTeam.SecondTeam
      : PlayerTeam.FirstTeam
  )!;
  const alliesTeamMap = match.teamsMap.get(currentPlayerTeam)!;

  const [activePlayer, setActivePlayer] = useState(
    match.players.find((player) => player.attackTurns.length > 0)!
  );

  const [selectedAmmo, setSelectedAmmo] = useState<Ammo | null>(
    match.availableAmmoTypes[0]
  );

  useEffect(() => {
    HubConnectionService.Instance.addSingular(
      MatchEventNames.AttackPerformed,
      handleAttackTurnEvent
    );

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onAttack();
      }
    });
  }, []);

  return (
    <div className="w-100 d-flex justify-content-center">
      <div className="w-100">
        <div className="w-100 d-flex  justify-content-center">{match.name}</div>

        <div className="w-100 d-flex justify-content-center gap-2">
          <MapGrid
            isEnemyMap={false}
            map={alliesTeamMap}
            title="Your map"
            selectedTile={selectedTile}
            onTileSelect={onOwnTileSelect}
          />

          <div className="col-2">
            <div>
              {alliesTeamPlayers.map((player, index) => (
                <div key={index}>
                  {player.name} ID{player.id} {player.team}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-100 d-flex justify-content-center gap-2 mt-6">
          <MapGrid
            isEnemyMap={true}
            map={enemiesTeamMap}
            title="Enemy map"
            selectedTile={selectedTile}
            onTileSelect={onAttackTurnTargetTileSelect}
          />
          <div className="col-2">
            <div>
              {enemiesTeamPlayers.map((player, index) => (
                <div key={index}>
                  {player.name} ID{player.id} {player.team}
                </div>
              ))}
            </div>
          </div>
        </div>

        <AmmoRack selectedAmmo={selectedAmmo} onAmmoSelect={onAmmoSelect} />

        <div className="mt-3 d-flex justify-content-center">
          <Button
            size="lg"
            disabled={!selectedTile || currentPlayer.attackTurns.length < 1}
            variant="danger"
            onClick={() => onAttack()}
          >
            Attack!
          </Button>
        </div>

        <h3 className="d-flex justify-content-center mt-3">
          {activePlayer.id === currentPlayer.id
            ? 'Your turn!'
            : activePlayer.name + "'s turn!"}
        </h3>

        <h4 className="d-flex justify-content-center mt-3">
          You are {currentPlayer.name} ID{currentPlayer.id}
        </h4>
      </div>
    </div>
  );

  function onAmmoSelect(ammo: Ammo): void {
    setSelectedAmmo(ammo);

    if (currentPlayer.attackTurns.length < 1) {
      toast.error('Sorry, you cannot select ammo now!');
      return;
    }

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
      attackerId: currentPlayer.id,
      attackerTeam: currentPlayer.team,
      tile: turn.tile,
      ammoType: turn.ammo.type,
    });

    setSelectedTile(null);
  }

  function handleAttackTurnEvent(data: any): void {
    const { attackerId, attackerTeam, tile, ammoType } =
      data as AttackTurnEventProps;

    console.log(data);

    const attackedTeam =
      attackerTeam === PlayerTeam.FirstTeam
        ? PlayerTeam.SecondTeam
        : PlayerTeam.FirstTeam;

    const attackedTeamMap = match.teamsMap.get(attackedTeam)!;
    const mapTile = attackedTeamMap.tiles[tile.x][tile.y];

    const attackFunc = AttackHandlerService.getAttackByAmmo(
      ammoType,
      match.availableAmmoTypes
    );

    attackFunc(mapTile, attackedTeamMap);

    switchTurn(attackerId);
  }

  function switchTurn(attackerId: number) {
    const players = match.players.sort((a, b) => a.id - b.id);

    // switch turn to next player
    const currentPlayerIdx = players.findIndex(
      (player) => player.id === attackerId
    );

    // find next player based on game players order
    const nextPlayerIdx =
      currentPlayerIdx + 1 < players.length ? currentPlayerIdx + 1 : 0;
    const nextPlayer = players[nextPlayerIdx];

    // if next player has no attack turns, give him one
    if (nextPlayer.attackTurns.length === 0) {
      nextPlayer.attackTurns.push(new AttackTurn());
    }

    // take turn from current player
    const currentPlayer = players[currentPlayerIdx];
    currentPlayer.attackTurns.shift();

    setActivePlayer(nextPlayer);
    rerender();
  }

  function rerender(): void {
    setRerenderToggle(Math.random() * 100);
  }
}
