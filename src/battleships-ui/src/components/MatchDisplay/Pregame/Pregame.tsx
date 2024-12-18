import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MatchSettings from "../../../models/MatchSettings";
import { Player } from "../../../models/Player";
import { AttackTurn } from "../../../models/Turns/AttackTurn";
import { MatchEventNames } from "../../../services/HubConnectionService/HubConnectionService";
import { MatchService } from "../../../services/MatchService/MatchService";
import { PlayerService } from "../../../services/PlayerService/PlayerService";
import MatchSettingsConfig from "../MatchSettings/MatchSettings";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import GameFacade from "@/services/GameFacade";

const minRequiredPlayers: number = 2;

export default function Pregame() {
  const navigate = useNavigate();

  const gameFacade = GameFacade.Instance;
  const match = gameFacade.getMatch();

  const [_, setRerenderToggle] = useState(0);
  const [readyPlayerIds, setReadyPlayerIds] = useState([] as number[]);

  const currentPlayer = PlayerService.getFromSessionStorage()!;

  useEffect(() => {
    gameFacade.addEventObservers({
      [MatchEventNames.PlayerJoined]: handlePlayerJoinedEvent,
      [MatchEventNames.PlayerUpdatedMatchSettings]:
        handleMatchSettingsChangedEvent,
      [MatchEventNames.PlayerLockedInSettings]:
        handlePlayerLockedInSettingsEvent,
      [MatchEventNames.PlayerLeftLobby]: handlePlayerLeftLobbyEvent,
    });

    function handleKeyDown(e: KeyboardEvent) {
      if (match.players.length >= minRequiredPlayers && e.key === "Enter") {
        onStartMatchButtonClick();
      }
    }

    function unloadCallback(_e: BeforeUnloadEvent) {
      gameFacade.removeEventObservers([
        MatchEventNames.PlayerJoined,
        MatchEventNames.PlayerUpdatedMatchSettings,
        MatchEventNames.PlayerLockedInSettings,
        MatchEventNames.PlayerLeftLobby,
      ]);

      gameFacade.sendEvent(MatchEventNames.PlayerLeftLobby, {
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

  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-center">
        <div className="text-3xl font-bold">{match.name}</div>
        <div className="text-xl">
          {match.players?.length < minRequiredPlayers
            ? "Waiting for the other players..."
            : "Waiting for all players to start the match..."}
        </div>
      </div>

      {match.players.length >= minRequiredPlayers && (
        <div className="w-full">
          <div className="mb-5">
            <MatchSettingsConfig matchSettings={match.settings} />
          </div>
          <div className="mb-5 flex items-center justify-center">
            <Button
              variant={"outline"}
              className="px-4 py-2"
              onClick={() => onStartMatchButtonClick()}
            >
              Ready to start
            </Button>
          </div>
        </div>
      )}

      {match.players.length > 0 && (
        <div className="w-full pt-6">
          <div className="mb-2 font-bold">Joined players</div>
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Ready</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {match.players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.id}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={readyPlayerIds.some((id) => id === player.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  );

  function onStartMatchButtonClick(): void {
    const currentPlayer = gameFacade.getPlayerFromSessionStorage();

    gameFacade.sendEvent(MatchEventNames.PlayerLockedInSettings, {
      player: currentPlayer,
    });
  }

  function handlePlayerJoinedEvent(data: any): void {
    const newlyJoinedPlayer = new Player(data.player);
    const currentPlayer = gameFacade.getPlayerFromSessionStorage();

    const alreadyJoined = match.players.some(
      (matchPlayer) => matchPlayer.id === newlyJoinedPlayer.id,
    );

    if (!alreadyJoined) {
      if (currentPlayer == null) {
        PlayerService.saveToSessionStorage(newlyJoinedPlayer);
      }

      match.players.push(newlyJoinedPlayer);

      if (currentPlayer != null) {
        gameFacade.sendEvent(MatchEventNames.PlayerJoined, {
          player: currentPlayer,
        });
      }
    }

    rerender();
  }

  function handleMatchSettingsChangedEvent(data: any): void {
    data = data as { matchSettings: MatchSettings };

    match.settings = data.matchSettings;

    rerender();
  }

  function handlePlayerLockedInSettingsEvent(data: any): void {
    const player = (data as { player: Player }).player;

    if (!readyPlayerIds.some((id) => id === player.id)) {
      readyPlayerIds.push(player.id);
      setReadyPlayerIds([...readyPlayerIds]);

      // check if length > 0 because value will change only after re-rendering
      if (
        readyPlayerIds.length === match.players.length &&
        match.players.length >= minRequiredPlayers &&
        match.isPregame
      ) {
        match.isPregame = false;

        MatchService.initMatchTeams();
        MatchService.initMatchAvailableAmmo();

        gameFacade.sendEvent(MatchEventNames.MatchStarted);

        const firstPlayer = match.players[0];
        firstPlayer.attackTurns.push(new AttackTurn());

        beginMatch();
      }
    }
  }

  function handlePlayerLeftLobbyEvent(data: any): void {
    const { playerId } = data as { playerId: number };

    const player = gameFacade.getMatchPlayer(playerId);

    if (!player) {
      console.error(`Player with ID ${playerId} not found.`);
      return;
    }

    toast.success(`Player ${player.name} [${player.id}] left the match!`);

    MatchService.removePlayerFromMatch(playerId);
    rerender();
  }

  function beginMatch(): void {
    navigate("/match/ShipPlacement");
  }

  function rerender(): void {
    setRerenderToggle(Math.random() * 100);
  }
}
