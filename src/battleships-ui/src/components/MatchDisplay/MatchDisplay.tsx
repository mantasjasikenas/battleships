import { useEffect, useState } from "react";
import { Ammo } from "../../models/Ammo";
import { MapTile } from "../../models/MatchMap";
import { Player, PlayerTeam } from "../../models/Player";
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
import { cn } from "@/lib/utils";
import { TileColor } from "@/models/Map/TileColors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";

export default function MatchDisplay() {
  const [_, setRerenderToggle] = useState(0);
  const [selectedTile, setSelectedTile] = useState<MapTile | null>(null);

  const match = MatchProvider.Instance.match;
  const currentPlayerId = PlayerService.getFromSessionStorage()!!.id;
  const currentPlayer = match.players.find(
    (player) => player.id === currentPlayerId,
  )!;

  const currentPlayerTeam = currentPlayer.team;

  const alliesTeamPlayers = match.players.filter(
    (player) => player.team === currentPlayerTeam,
  );
  const enemiesTeamPlayers = match.players.filter(
    (player) => player.team !== currentPlayerTeam,
  );

  const enemiesTeamMap = match.teamsMap.get(
    currentPlayerTeam === PlayerTeam.FirstTeam
      ? PlayerTeam.SecondTeam
      : PlayerTeam.FirstTeam,
  )!;
  const alliesTeamMap = match.teamsMap.get(currentPlayerTeam)!;

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

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onAttack();
      }
    });
  }, []);

  const renderPlayersList = (players: Player[]) => {
    return (
      <div className="flex space-x-4">
        {[players].map((team, index) => (
          <Card key={index} className="w-48">
            <CardHeader>
              <CardTitle className="text-sm">{team[0].team}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {team.map((player) => (
                  <li
                    key={player.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span
                      className={cn(
                        "flex items-center",
                        player.id === currentPlayer.id && "font-bold underline",
                      )}
                    >
                      <span className="inline-block w-6">{player.id}</span>
                      <span>{player.name}</span>
                    </span>
                    {player.id === activePlayer.id && (
                      <Badge variant="secondary" className="text-xs">
                        {player.id === currentPlayer.id ? "Your turn" : "Turn"}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderLegend = () => {
    const legendItems = [
      { color: TileColor.Selected, text: "Selected" },
      { color: TileColor.Ship, text: "Your Ships" },
      { color: TileColor.Miss, text: "Miss" },
      { color: TileColor.Destroyed, text: "Destroyed" },
      { color: TileColor.Damaged, text: "Damaged" },
    ];

    return (
      <div className="mt-4 flex items-center justify-center space-x-4 text-zinc-300">
        {legendItems.map((item) => (
          <div className="flex items-center">
            <div className={cn("mr-2 h-4 w-4", item.color)}></div>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex w-screen">
      <div className="flex w-full flex-col">
        <div className="flex w-full justify-center text-3xl font-bold">
          {match.name}
        </div>

        <div className="flex flex-row justify-center gap-8 pt-4">
          <div className="flex flex-col items-start justify-end gap-6">
            {renderPlayersList(alliesTeamPlayers)}

            <MapGrid
              isEnemyMap={false}
              map={alliesTeamMap}
              title="Your map"
              selectedTile={selectedTile}
              onTileSelect={onOwnTileSelect}
            />
          </div>

          <div className="flex flex-col items-end justify-end gap-6">
            {renderPlayersList(enemiesTeamPlayers)}

            <MapGrid
              isEnemyMap={true}
              map={enemiesTeamMap}
              title="Enemy map"
              selectedTile={selectedTile}
              onTileSelect={onAttackTurnTargetTileSelect}
            />
          </div>
        </div>

        {renderLegend()}

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

    if (currentPlayer.attackTurns.length < 1) {
      toast.error("Sorry, you cannot select ammo now!");
      return;
    }

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
      match.availableAmmoTypes,
    );

    attackFunc(mapTile, attackedTeamMap);

    switchTurn(attackerId);
  }

  function switchTurn(attackerId: number) {
    const players = match.players.sort((a, b) => a.id - b.id);

    // switch turn to next player
    const currentPlayerIdx = players.findIndex(
      (player) => player.id === attackerId,
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
