import { useEffect, useState } from "react";
import { Ammo } from "../../models/Ammo";
import { MapTile } from "../../models/MatchMap";
import { invertTeam, Player, PlayerTeam } from "../../models/Player";
import { AttackTurnEventProps } from "../../services/AttackHandlerService/AttackHandlerService";
import { MatchEventNames } from "../../services/HubConnectionService/HubConnectionService";
import AmmoRack from "./AmmoRack/AmmoRack";
import MapGrid from "./MapGrid/MapGrid";
import { AttackTurn } from "../../models/Turns/AttackTurn";
import { toast } from "sonner";
import { Button } from "../ui/button";
import MatchTimer from "../MatchTimer";
import PlayerList from "./PlayerList";
import GameLegend from "./GameLegend";
import { useNavigate } from "react-router-dom";
import { calculateTeamStats, TeamStats } from "@/lib/statsUtils";
import Scoreboard from "../Scoreboard";
import { AttackCommand, AttackFactory } from "@/models/command";
import GameFacadeProxy from "@/services/GameFacadeProxy";
import AdminPanel from "../AdminPanel";
import { AdminActions } from "@/models/AdminActions";
import { AmmoType } from "../../models/Ammo";
import GameFacade from "@/services/GameFacade";
import ShipComposite from "../ShipComposite";
import ShipLeaf from "../ShipLeaf";

export default function MatchDisplay() {
  const navigate = useNavigate();

  const [adminMode, setAdminMode] = useState(false);

  const [_, setRerenderToggle] = useState(0);
  const [selectedTile, setSelectedTile] = useState<MapTile | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gaveUpPlayers, setGaveUpPlayers] = useState([] as number[]);

  const [adminMessage, setAdminMessage] = useState<string | undefined>(
    undefined,
  );

  const gameFacadeProxy = GameFacadeProxy.Instance;
  const gameFacade = gameFacadeProxy as GameFacade;
  const match = gameFacade.getMatch();

  const currentPlayerId = gameFacade.getPlayerFromSessionStorage()!.id;
  const currentPlayer = gameFacade.getMatchPlayer(currentPlayerId)!;

  const currentPlayerTeam = currentPlayer.team;
  const enemyTeam = invertTeam(currentPlayerTeam);

  const alliesTeamPlayers = gameFacade.getMatchTeamPlayers(currentPlayerTeam);
  const enemiesTeamPlayers = gameFacade.getMatchTeamPlayers(enemyTeam);

  const alliesTeamMap = gameFacade.getTeamMap(currentPlayerTeam)!;
  const enemiesTeamMap = gameFacade.getTeamMap(enemyTeam)!;

  const [activePlayer, setActivePlayer] = useState(
    match.players.find((player) => player.attackTurns.length > 0)!,
  );

  const [selectedAmmo, setSelectedAmmo] = useState<Ammo | null>(
    match.availableAmmoTypes.values[0],
  );

  const [turnRemainingTime, setTurnRemainingTime] = useState(60);

  const [alliesTeamStats, setAlliesTeamStats] = useState<TeamStats>(
    new TeamStats(),
  );
  const [enemyTeamsStats, setEnemyTeamsStats] = useState<TeamStats>(
    new TeamStats(),
  );

  const adminActions = [
    {
      name: "Destroy all ships",
      action: () => {
        gameFacade.sendEvent(MatchEventNames.Admin, {
          senderId: currentPlayerId,
          command: AdminActions.DestroyAllShips,
        });
      },
    },
    {
      name: "Report ship status",
      action: () => {
        gameFacade.sendEvent(MatchEventNames.Admin, {
          senderId: currentPlayerId,
          command: AdminActions.ReportShipStatus,
        });
      },
    },
  ];

  const updateCooldowns = () => {
    gameFacade.getMatch().players.forEach((player) => {
      player.reduceCooldown();
    });
  };

  useEffect(() => {
    const cooldownTimerId = setInterval(() => {
      updateCooldowns();

      checkAmmoCooldown(AmmoType.Classic);
      checkAmmoCooldown(AmmoType.Standard);
      checkAmmoCooldown(AmmoType.ArmorPiercing);
      checkAmmoCooldown(AmmoType.HighExplosive);
      checkAmmoCooldown(AmmoType.DepthCharge);
    }, 1000);

    return () => clearInterval(cooldownTimerId);
  }, []);

  const checkAmmoCooldown = (ammoType: AmmoType) => {
    gameFacade.getMatch().players.forEach((player) => {
      if (ammoType && player.isCooldownDone(ammoType)) {
        const ammoTypeName = AmmoType[ammoType];
        toast.success(`${ammoTypeName} ammo is ready to fire!`, {
          id: `${ammoType}-attack-toast`,
          duration: 3000,
        });
      }
    });
  };

  useEffect(() => {
    const turnEndTime = Date.now() + 60 * 1000;

    const turnTimerId = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((turnEndTime - Date.now()) / 1000),
      );
      setTurnRemainingTime(remaining);

      if (remaining === 0) {
        clearInterval(turnTimerId);

        switchTurn(activePlayer.id);
        toast.error("Time's up!");
      }
    }, 1000);

    return () => clearInterval(turnTimerId);
  }, [activePlayer]);

  useEffect(() => {
    if (activePlayer.id === currentPlayer.id) {
      toast.success("It's your turn!", { id: "turn-toast", duration: 5000 });
    }
  }, [activePlayer]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setAdminMode((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);

    gameFacade.addEventObservers(
      {
        [MatchEventNames.AttackPerformed]: handleAttackTurnEvent,
        [MatchEventNames.UndoCommand]: handleUndoCommandEvent,
        [MatchEventNames.PlayerGaveUp]: handlePlayerGaveUpEvent,
        [MatchEventNames.PlayerLeft]: handlePlayerLeftEvent,
        [MatchEventNames.Admin]: handleAdminEvent,
      },
      true,
    );

    function unloadCallback(_e: BeforeUnloadEvent) {
      gameFacade.removeEventObservers([
        MatchEventNames.AttackPerformed,
        MatchEventNames.PlayerGaveUp,
        MatchEventNames.PlayerLeft,
        MatchEventNames.UndoCommand,
      ]);

      gameFacade.sendEvent(MatchEventNames.PlayerLeft, {
        playerId: currentPlayer.id,
      });
    }

    window.addEventListener("beforeunload", unloadCallback);

    return () => {
      window.removeEventListener("beforeunload", unloadCallback);
      document.removeEventListener("keydown", down);
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

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-col items-center">
              <MatchTimer
                duration={match.duration}
                onTimeUp={onMatchTimerEnd}
              />
              <div className="mt-2 text-2xl tabular-nums">
                {`${Math.floor(turnRemainingTime / 60)}:${String(turnRemainingTime % 60).padStart(2, "0")}`}
              </div>
            </div>

            <div className="mb-auto">
              <Scoreboard
                alliesTeamStats={alliesTeamStats}
                enemyTeamStats={enemyTeamsStats}
              />
            </div>
          </div>

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

        {adminMode && (
          <AdminPanel
            message={adminMessage}
            actions={adminActions}
            onMessageClear={() => setAdminMessage(undefined)}
          />
        )}

        <div className="mt-8 flex justify-center gap-2">
          <Button
            disabled={!selectedTile || currentPlayer.attackTurns.length < 1}
            variant={"destructive"}
            onClick={() => onAttack()}
          >
            Attack!
          </Button>
          <Button
            disabled={currentPlayer.invoker.commands.length < 1}
            onClick={() => onUndo()}
          >
            Undo
          </Button>
        </div>
      </div>
    </div>
  );

  function handleUndoCommandEvent(data: any) {
    const { userId } = data;
    const user = match.players.find((player) => player.id === userId)!;
    user.invoker.undo();
    rerender();
  }

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
    turn.ammo.onAttack(gameFacade, currentPlayer, turn, turn.tile);
    setSelectedTile(null);
  }

  function onUndo(): void {
    gameFacade.sendEvent(MatchEventNames.UndoCommand, {
      userId: currentPlayerId,
    });
  }

  function onGaveUp(): void {
    gameFacade.sendEvent(MatchEventNames.PlayerGaveUp, {
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

    gameFacade.resetMatch();

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
    setTurnRemainingTime(60); // reset to 60 seconds for the next player's turn
  }

  function rerender(): void {
    setRerenderToggle(Math.random() * 100);
  }

  function handleAdminEvent(data: any): void {
    const { senderId, command } = data as {
      senderId: number;
      command: AdminActions;
    };

    const sender = gameFacade.getMatchPlayer(senderId);

    if (!sender) {
      console.error(`Player with ID ${senderId} not found.`);
      return;
    }

    if (command === AdminActions.DestroyAllShips) {
      handleDestroyAllShipsEvent(sender);
    } else if (command === AdminActions.ReportShipStatus) {
      handleReportShipStatusEvent(sender);
    }
  }

  function handleDestroyAllShipsEvent(sender: Player): void {
    const attackedTeam = invertTeam(sender.team);

    if (gameFacade.destroyAllShips(sender, attackedTeam)) {
      onGameOver(attackedTeam);
    } else if (currentPlayer.id === sender.id) {
      toast.error("You are not authorized to perform this action!");
    }
  }

  function handleReportShipStatusEvent(sender: Player): void {
    const allFleets = new ShipComposite("All Fleets");

    const alliesFleet = new ShipComposite("Allies Fleet");
    const enemiesFleet = new ShipComposite("Enemies Fleet");

    alliesTeamMap.tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.shipPart) {
          alliesFleet.add(new ShipLeaf(tile.shipPart, tile.shipPart.shipClass));
        }
      });
    });

    enemiesTeamMap.tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.shipPart) {
          enemiesFleet.add(
            new ShipLeaf(tile.shipPart, tile.shipPart.shipClass),
          );
        }
      });
    });

    allFleets.add(alliesFleet);
    allFleets.add(enemiesFleet);

    setAdminMessage(allFleets.display());
  }

  function handleAttackTurnEvent(data: any): void {
    const { attackerId, attackerTeam, tile, ammoType } =
      data as AttackTurnEventProps;

    const attacker = match.players.find((player) => player.id === attackerId)!;

    const attackedTeam = invertTeam(attackerTeam);

    const info = AttackFactory.getInfo(attackerTeam, ammoType);

    attacker.invoker.execute(new AttackCommand(tile, info));

    if (attackerTeam === currentPlayerTeam) {
      setAlliesTeamStats((_prev) => calculateTeamStats(enemiesTeamMap));
    } else {
      setEnemyTeamsStats((_prev) => calculateTeamStats(alliesTeamMap));
    }

    if (checkIfAllShipsDestroyed(attackedTeam)) {
      toast.success("All ships are destroyed! Team " + attackedTeam + " lost!");
      onGameOver(attackedTeam);
    }

    switchTurn(attackerId);
  }

  function handlePlayerGaveUpEvent(data: any): void {
    const { playerId } = data as { playerId: number };

    const player = gameFacade.getMatchPlayer(playerId);

    if (!player) {
      console.error(`Player with ID ${playerId} not found.`);
      return;
    }

    toast.success(`Player ${player.name} gave up!`);

    setGaveUpPlayers((prev) => {
      const updatedGaveUpPlayers = [...prev, playerId];

      const teamPlayers = gameFacade.getMatchTeamPlayers(player.team);
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

    const player = gameFacade.getMatchPlayer(playerId);

    if (!player) {
      console.error(`Player with ID ${playerId} not found.`);
      return;
    }

    toast.success(`Player ${player.name} [${player.id}] left the match!`);

    gameFacade.removePlayerFromMatch(playerId);

    if (activePlayer.id === playerId) {
      switchTurn(playerId);
    } else {
      rerender();
    }

    const teamPlayers = gameFacade.getMatchTeamPlayers(player.team);

    if (teamPlayers.length === 0) {
      onGameOver(invertTeam(player.team));
    }
  }

  function checkIfAllShipsDestroyed(attackedTeam: PlayerTeam): boolean {
    const attackedTeamMap = match.teamsMap.get(attackedTeam)!;
    const tiles = attackedTeamMap.tiles;

    for (const row of tiles) {
      for (const tile of row) {
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
