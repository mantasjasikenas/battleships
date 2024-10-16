import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Match } from "../../../models/Match";
import MatchSettings from "../../../models/MatchSettings";
import { Player } from "../../../models/Player";
import { AttackTurn } from "../../../models/Turns/AttackTurn";
import HubConnectionService, {
  MatchEventNames,
} from "../../../services/HubConnectionService/HubConnectionService";
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
import MatchProvider from "@/services/MatchProvider/MatchProvider";
import { toast } from "sonner";

const minRequiredPlayers: number = 2;

export default function Pregame() {
  const navigate = useNavigate();

  const match = useLoaderData() as Match;

  const [_, setRerenderToggle] = useState(0);
  const [readyPlayerIds, setReadyPlayerIds] = useState([] as number[]);

  const currentPlayer = PlayerService.getFromSessionStorage()!;

  useEffect(() => {
    HubConnectionService.Instance.add(
      MatchEventNames.PlayerJoined,
      handlePlayerJoinedEvent,
    );
    HubConnectionService.Instance.add(
      MatchEventNames.PlayerUpdatedMatchSettings,
      handleMatchSettingsChangedEvent,
    );
    HubConnectionService.Instance.add(
      MatchEventNames.PlayerLockedInSettings,
      handlePlayerLockedInSettingsEvent,
    );
    HubConnectionService.Instance.add(
      MatchEventNames.PlayerLeftLobby,
      handlePlayerLeftLobbyEvent,
    );

    function handleKeyDown(e: KeyboardEvent) {
      if (match.players.length >= minRequiredPlayers && e.key === "Enter") {
        onStartMatchButtonClick();
      }
    }

    function unloadCallback(_e: BeforeUnloadEvent) {
      HubConnectionService.Instance.remove(MatchEventNames.PlayerJoined);
      HubConnectionService.Instance.remove(
        MatchEventNames.PlayerUpdatedMatchSettings,
      );
      HubConnectionService.Instance.remove(
        MatchEventNames.PlayerLockedInSettings,
      );
      HubConnectionService.Instance.remove(MatchEventNames.PlayerLeftLobby);

      HubConnectionService.Instance.sendEvent(MatchEventNames.PlayerLeftLobby, {
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
    const currentPlayer = PlayerService.getFromSessionStorage();

    HubConnectionService.Instance.sendEvent(
      MatchEventNames.PlayerLockedInSettings,
      { player: currentPlayer },
    );
  }

  function handlePlayerJoinedEvent(data: any): void {
    const newlyJoinedPlayer = new Player(data.player);
    const currentPlayer = PlayerService.getFromSessionStorage();

    const alreadyJoined = match.players.some(
      (matchPlayer) => matchPlayer.id === newlyJoinedPlayer.id,
    );

    if (!alreadyJoined) {
      if (currentPlayer == null) {
        PlayerService.saveToSessionStorage(newlyJoinedPlayer);
      }

      match.players.push(newlyJoinedPlayer);

      if (currentPlayer != null) {
        HubConnectionService.Instance.sendEvent(MatchEventNames.PlayerJoined, {
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

        HubConnectionService.Instance.sendEvent(MatchEventNames.MatchStarted);

        const firstPlayer = match.players[0];
        firstPlayer.attackTurns.push(new AttackTurn());

        beginMatch();
      }
    }
  }

  function handlePlayerLeftLobbyEvent(data: any): void {
    const { playerId } = data as { playerId: number };

    const player = MatchProvider.getPlayer(playerId);

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
