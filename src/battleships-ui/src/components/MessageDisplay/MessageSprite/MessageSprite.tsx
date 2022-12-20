import {
  DisplayableMessage,
  MESSAGE_DISPLAY_INTERVAL_SECS,
} from '../MessageDisplay';
import './MessageSprite.css';

export interface MessageSpriteProps {
  message: DisplayableMessage;
}

export function MessageSprite({ message }: MessageSpriteProps) {
  const element = (
    <div
      className="message-sprite"
      style={{
        left: message.left,
        animationDuration: MESSAGE_DISPLAY_INTERVAL_SECS.toString() + 's',
      }}
    >
      <span className="message-sender">{message.message.player.name}:</span>
      <span className="message-text">{message.message.text}</span>
    </div>
  );
  return element;
}
