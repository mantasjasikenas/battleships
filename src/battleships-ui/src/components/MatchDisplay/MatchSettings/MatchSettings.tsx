import Dropdown from 'react-bootstrap/esm/Dropdown';
import MatchSettings, { GameMode } from '../../../models/MatchSettings';
import HubConnectionService, {
  MatchEventNames,
} from '../../../services/HubConnectionService/HubConnectionService';

interface MatchSettingsProps {
  matchSettings: MatchSettings;
}

export default function MatchSettingsConfig(props: MatchSettingsProps) {
  const matchSettings = props.matchSettings;

  function onGameModeSelect(value: GameMode) {
    matchSettings.gameMode = value;

    onSettingsUpdate();
  }

  function onUseDiceCheck(value: boolean) {
    matchSettings.useDice = value;

    onSettingsUpdate();
  }

  function onSettingsUpdate() {
    HubConnectionService.Instance.sendEvent(
      MatchEventNames.PlayerUpdatedMatchSettings,
      { matchSettings: matchSettings }
    );
  }

  return (
    <div className="mb-2">
      <div className="mb-2">
        <b>Configure match settings</b>
      </div>
      <div className="mb-2">
        <span>Game mode:</span>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {matchSettings?.gameMode ?? 'Game mode'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {Object.values(GameMode).map((mode) => (
              <Dropdown.Item key={mode} onClick={() => onGameModeSelect(mode)}>
                {mode}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="mb-2">
        <span>Use dice: </span>
        <input
          name="useDice"
          type="checkbox"
          checked={matchSettings.useDice}
          onChange={(event) => onUseDiceCheck(event.target.checked)}
        />
      </div>
    </div>
  );
}
