import { useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import { generatePath, useNavigate } from 'react-router-dom';
import HubConnectionService, {
  MatchEventNames,
} from '../../services/HubConnectionService/HubConnectionService';
import { PlayerService } from '../../services/PlayerService/PlayerService';

export default function NewMatch() {
  const navigate = useNavigate();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    const playerName = !!inputRef.current?.value
      ? inputRef.current?.value
      : 'New player';

    const player = PlayerService.createNew(playerName);

    PlayerService.saveToSessionStorage(player);

    HubConnectionService.Instance.sendEvent(MatchEventNames.PlayerJoined, {
      player: player,
    });

    HubConnectionService.Instance.sendEvent(MatchEventNames.NewMatch);

    const path = generatePath('match/pregame');

    navigate(path);
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <Form>
          <Form.Group className="mb-3 text-center">
            <Form.Control
              required
              type="text"
              placeholder="New player"
              ref={inputRef}
            />
          </Form.Group>
        </Form>
        <Button className="primary" onClick={handleClick}>
          Join a match!
        </Button>
      </div>
    </div>
  );
}
