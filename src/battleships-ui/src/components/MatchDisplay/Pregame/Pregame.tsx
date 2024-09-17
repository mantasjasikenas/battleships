import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Match } from '../../../models/Match';
import MatchSettings from '../../../models/MatchSettings';
import { Player } from '../../../models/Player';
import { AttackTurn } from '../../../models/Turns/AttackTurn';
import HubConnectionService, {
  MatchEventNames,
} from '../../../services/HubConnectionService/HubConnectionService';
import { MatchService } from '../../../services/MatchService/MatchService';
import { PlayerService } from '../../../services/PlayerService/PlayerService';
import MatchSettingsConfig from '../MatchSettings/MatchSettings';
import { toast } from 'sonner';

const minRequiredPlayers: number = 2;

export default function Pregame() {
  const navigate = useNavigate();

  const match = useLoaderData() as Match;

  const [_, setRerenderToggle] = useState(0);
  const [readyPlayerIds, setReadyPlayerIds] = useState([] as number[]);

  useEffect(() => {
    HubConnectionService.Instance.add(
      MatchEventNames.PlayerJoined,
      handlePlayerJoinedEvent
    );
    HubConnectionService.Instance.add(
      MatchEventNames.SecondPlayerJoinedConfirmation,
      handlePlayerJoinedEvent
    );
    HubConnectionService.Instance.add(
      MatchEventNames.PlayerUpdatedMatchSettings,
      handleMatchSettingsChangedEvent
    );
    HubConnectionService.Instance.add(
      MatchEventNames.PlayerLockedInSettings,
      handlePlayerLockedInSettingsEvent
    );

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (match.players.length >= minRequiredPlayers && e.key === 'Enter') {
        onStartMatchButtonClick();
      }
    });
  }, []);

  return (
    <div className="container">
      <div className="container mb-5">
        <h1>{match.name}</h1>
        <h2>
          {match.players?.length < minRequiredPlayers
            ? 'Waiting for the other players...'
            : 'Waiting for all players to start the match...'}
        </h2>
      </div>

      {match.players.length >= minRequiredPlayers && (
        <div>
          <div className="mb-5">
            <MatchSettingsConfig
              matchSettings={match.settings}
            ></MatchSettingsConfig>
          </div>
          <div className="mb-5">
            <Button
              className="primary"
              onClick={() => onStartMatchButtonClick()}
            >
              Start match
            </Button>
          </div>
        </div>
      )}

      <div>
        <h3>Joined Players</h3>
        <ul>
          {match.players.map((player) => (
            <li key={player.id}>
              {player.id} {player.name}{' '}
              <input
                type="checkbox"
                checked={readyPlayerIds.some((id) => id === player.id)}
                readOnly
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  function onStartMatchButtonClick(): void {
    const currentPlayer = PlayerService.getFromSessionStorage();

    HubConnectionService.Instance.sendEvent(
      MatchEventNames.PlayerLockedInSettings,
      { player: currentPlayer }
    );
  }

  function handlePlayerJoinedEvent(data: any): void {
    const newlyJoinedPlayer = new Player(data.player);
    const currentPlayer = PlayerService.getFromSessionStorage();

    const alreadyJoined = match.players.some(
      (matchPlayer) => matchPlayer.id === newlyJoinedPlayer.id
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

    setRerenderToggle(Math.random());
  }

  function handleMatchSettingsChangedEvent(data: any): void {
    data = data as { matchSettings: MatchSettings };

    match.settings = data.matchSettings;

    setRerenderToggle(Math.random());
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
        MatchService.initMatchPlayerVehicles();
        MatchService.initMatchAvailableAmmo();

        HubConnectionService.Instance.sendEvent(MatchEventNames.MatchStarted);

        const firstPlayer = match.players[0];
        firstPlayer.attackTurns.push(new AttackTurn());

        beginMatch();
      }
    }
  }

  function beginMatch(): void {
    navigate('/match');
  }
}
