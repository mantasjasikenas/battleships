import { useEffect, useState } from "react";
import { Ammo } from "../../models/Ammo";
import { MapTile } from "../../models/MatchMap";
import { invertTeam, PlayerTeam } from "../../models/Player";
import {
  AttackHandlerService,
  AttackTurnEventProps,
} from "../../services/AttackHandlerService/AttackHandlerService";
import HubConnectionService, {
  MatchEventNames,
} from "../../services/HubConnectionService/HubConnectionService";
import MatchProvider from "../../services/MatchProvider/MatchProvider";
import AmmoRack from "./AmmoRack/AmmoRack";
import MapGrid from "./MapGrid/MapGrid";
import { AttackTurn } from "../../models/Turns/AttackTurn";
import { toast } from "sonner";
import { PlayerService } from "../../services/PlayerService/PlayerService";
import { Button } from "../ui/button";
import MatchTimer from "../MatchTimer";
import PlayerList from "./PlayerList";
import GameLegend from "./GameLegend";
import { useNavigate } from "react-router-dom";
import { MatchService } from "@/services/MatchService/MatchService";

export default function MatchDisplay() {
  const navigate = useNavigate();

  const [_, setRerenderToggle] = useState(0);
  const [selectedTile, setSelectedTile] = useState<MapTile | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gaveUpPlayers, setGaveUpPlayers] = useState([] as number[]);

  const match = MatchProvider.Instance.match;

  const currentPlayerId = PlayerService.getFromSessionStorage()!!.id;
  const currentPlayer = MatchProvider.getPlayer(currentPlayerId)!;

  const currentPlayerTeam = currentPlayer.team;
  const enemyTeam = invertTeam(currentPlayerTeam);

  const alliesTeamPlayers = MatchProvider.getTeamPlayers(currentPlayerTeam);
  const enemiesTeamPlayers = MatchProvider.getTeamPlayers(enemyTeam);

  const alliesTeamMap = match.teamsMap.get(currentPlayerTeam)!;
  const enemiesTeamMap = match.teamsMap.get(enemyTeam)!;

  const [activePlayer, setActivePlayer] = useState(
    match.players.find((player) => player.attackTurns.length > 0)!,
  );

  const [selectedAmmo, setSelectedAmmo] = useState<Ammo | null>(
    match.availableAmmoTypes[0],
  );

  useEffect(() => {
    if (activePlayer.id === currentPlayer.id) {
      toast.success("It's your turn!", { id: "turn-toast" });
    }
  }, [activePlayer]);

  useEffect(() => {
    HubConnectionService.Instance.addSingular(
      MatchEventNames.AttackPerformed,
      handleAttackTurnEvent,
    );

    HubConnectionService.Instance.addSingular(
      MatchEventNames.PlayerGaveUp,
      handlePlayerGaveUpEvent,
    );

    HubConnectionService.Instance.addSingular(
      MatchEventNames.PlayerLeft,
      handlePlayerLeftEvent,
    );

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        onAttack();
      }
    }

    function unloadCallback(_e: BeforeUnloadEvent) {
      HubConnectionService.Instance.remove(MatchEventNames.AttackPerformed);
      HubConnectionService.Instance.remove(MatchEventNames.PlayerGaveUp);
      HubConnectionService.Instance.remove(MatchEventNames.PlayerLeft);

      HubConnectionService.Instance.sendEvent(MatchEventNames.PlayerLeft, {
        playerId: currentPlayer.id,
      });
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", unloadCallback);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", unloadCallback);
    };
  }, []);

  if (gameOver) {
    return <div>Game Over!</div>;
  }

  return (
    <div className="flex w-screen">
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-center text-3xl font-bold">
          {match.name}
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-8 pt-4">
          <div className="flex flex-col items-start justify-end gap-6">
            <PlayerList
              players={alliesTeamPlayers}
              activePlayer={activePlayer}
              currentPlayer={currentPlayer}
              onGaveUp={onGaveUp}
              gaveUpPlayers={gaveUpPlayers}
            />

            <MapGrid
              isEnemyMap={false}
              map={alliesTeamMap}
              title="Your map"
              selectedTile={selectedTile}
              onTileSelect={onOwnTileSelect}
            />
          </div>

          <MatchTimer duration={match.duration} onTimeUp={onMatchTimerEnd} />

          <div className="flex flex-col items-end justify-end gap-6">
            <PlayerList
              players={enemiesTeamPlayers}
              activePlayer={activePlayer}
              currentPlayer={currentPlayer}
              gaveUpPlayers={gaveUpPlayers}
            />

            <MapGrid
              isEnemyMap={true}
              map={enemiesTeamMap}
              title="Enemy map"
              selectedTile={selectedTile}
              onTileSelect={onAttackTurnTargetTileSelect}
            />
          </div>
        </div>

        <GameLegend />

        <AmmoRack selectedAmmo={selectedAmmo} onAmmoSelect={onAmmoSelect} />

        <div className="mt-8 flex justify-center">
          <Button
            disabled={!selectedTile || currentPlayer.attackTurns.length < 1}
            variant={"destructive"}
            onClick={() => onAttack()}
          >
            Attack!
          </Button>
        </div>
      </div>
    </div>
  );

  function onAmmoSelect(ammo: Ammo): void {
    setSelectedAmmo(ammo);
    currentPlayer.attackTurns[0].ammo = ammo;
  }

  function onAttackTurnTargetTileSelect(tile: MapTile): void {
    if (currentPlayer.attackTurns.length < 1) {
      toast.error("Sorry, it is not your turn!", { id: "not-your-turn-toast" });
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
    toast.error("Cannot attack own ships!", { id: "own-ship-attack-toast" });
  }

  function onAttack(): void {
    const turn = currentPlayer.attackTurns[0];

    if (!turn.ammo && selectedAmmo) {
      turn.ammo = selectedAmmo;
    }

    if (!turn.tile || !turn.ammo) {
      toast.error("Select ammo and tile to attack first!", {
        id: "attack-toast",
      });

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

  function onGaveUp(): void {
    HubConnectionService.Instance.sendEvent(MatchEventNames.PlayerGaveUp, {
      playerId: currentPlayer.id,
    });
  }

  function onMatchTimerEnd(): void {
    toast.info("Time's up!");

    const winningTeam = getWinningTeam();

    onGameOver(winningTeam!);
  }

  function onGameOver(winningTeam: PlayerTeam | null): void {
    setGameOver(true);

    MatchProvider.reset();

    navigate("/gameover", {
      state: { winningTeam },
    });
  }

  function switchTurn(attackerId: number) {
    const players = match.players.sort((a, b) => a.id - b.id);

    // switch turn to next player
    const currentPlayerIdx = players.findIndex(
      (player) => player.id === attackerId,
    );

    // handle case when player left the match
    if (currentPlayerIdx === -1) {
      toast.error("Player left the match, switching turn to next player.");

      players[0].attackTurns.push(new AttackTurn());
      setActivePlayer(players[0]);

      return;
    }

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
  }

  function rerender(): void {
    setRerenderToggle(Math.random() * 100);
  }

  function handleAttackTurnEvent(data: any): void {
    const { attackerId, attackerTeam, tile, ammoType } =
      data as AttackTurnEventProps;

    const attackedTeam = invertTeam(attackerTeam);

    const attackedTeamMap = match.teamsMap.get(attackedTeam)!;
    const mapTile = attackedTeamMap.tiles[tile.x][tile.y];

    const attackFunc = AttackHandlerService.getAttackByAmmo(
      ammoType,
      match.availableAmmoTypes,
    );

    attackFunc(mapTile, attackedTeamMap);

    if (checkIfAllShipsDestroyed(attackedTeam)) {
      toast.success("All ships are destroyed! Team " + attackedTeam + " lost!");
      onGameOver(attackedTeam);
    }

    switchTurn(attackerId);
  }

  function handlePlayerGaveUpEvent(data: any): void {
    const { playerId } = data as { playerId: number };

    const player = MatchProvider.getPlayer(playerId);

    if (!player) {
      console.error(`Player with ID ${playerId} not found.`);
      return;
    }

    toast.success(`Player ${player.name} gave up!`);

    setGaveUpPlayers((prev) => {
      const updatedGaveUpPlayers = [...prev, playerId];

      const teamPlayers = MatchProvider.getTeamPlayers(player.team);
      const teamGaveUp = teamPlayers.every((teamPlayer) =>
        updatedGaveUpPlayers.includes(teamPlayer.id),
      );

      if (teamGaveUp) {
        onGameOver(invertTeam(player.team));
      }

      return updatedGaveUpPlayers;
    });
  }

  function handlePlayerLeftEvent(data: any): void {
    const { playerId } = data as { playerId: number };

    const player = MatchProvider.getPlayer(playerId);

    if (!player) {
      console.error(`Player with ID ${playerId} not found.`);
      return;
    }

    toast.success(`Player ${player.name} [${player.id}] left the match!`);

    MatchService.removePlayerFromMatch(playerId);

    if (activePlayer.id === playerId) {
      switchTurn(playerId);
    } else {
      rerender();
    }

    const teamPlayers = MatchProvider.getTeamPlayers(player.team);

    if (teamPlayers.length === 0) {
      onGameOver(invertTeam(player.team));
    }
  }

  function checkIfAllShipsDestroyed(attackedTeam: PlayerTeam): boolean {
    const attackedTeamMap = match.teamsMap.get(attackedTeam)!;
    const tiles = attackedTeamMap.tiles;

    for (let row of tiles) {
      for (let tile of row) {
        if (tile.shipPart && !tile.isShipPartDestroyed) {
          return false;
        }
      }
    }

    return true;
  }

  function getWinningTeam(): PlayerTeam | null {
    const countDestroyedShips = (team: PlayerTeam) =>
      match.teamsMap
        .get(team)!
        .tiles.flat()
        .filter((tile) => tile.shipPart && tile.isShipPartDestroyed).length;

    const firstTeamDestroyedShips = countDestroyedShips(PlayerTeam.FirstTeam);
    const secondTeamDestroyedShips = countDestroyedShips(PlayerTeam.SecondTeam);

    if (firstTeamDestroyedShips > secondTeamDestroyedShips) {
      return PlayerTeam.SecondTeam;
    } else if (secondTeamDestroyedShips > firstTeamDestroyedShips) {
      return PlayerTeam.FirstTeam;
    }

    return null;
  }
}
