import { useEffect, useState } from 'react';
import { Message } from '../../models/Message/Message';
import { PlayerTeam } from '../../models/Player';
import { CommsEventProps } from '../../services/CommandInterpreter/Interpreter/Interpreter';
import ConnectionMediatorService, {
  MatchEventNames,
} from '../../services/ConnectionMediatorService/ConnectionMediatorService';
import MatchProvider from '../../services/MatchProvider/MatchProvider';
import { MessageSprite } from './MessageSprite/MessageSprite';

export const MESSAGE_DISPLAY_INTERVAL_SECS = 5;
const MESSAGE_DISPLAY_MARGIN_PX = 50;

export class DisplayableMessage {
  public message: Message;
  public created: Date;
  public bottom: number;
  public left: number;

  constructor(message: Message, created: Date) {
    this.message = message;
    this.created = created;

    this.bottom = MESSAGE_DISPLAY_MARGIN_PX;
    this.left =
      3 * MESSAGE_DISPLAY_MARGIN_PX +
      Math.random() * (window.innerWidth - 3 * MESSAGE_DISPLAY_MARGIN_PX);
  }
}

export function MessageDisplay() {
  const [messages, setMessages] = useState([] as DisplayableMessage[]);

  useEffect(() => {
    ConnectionMediatorService.Instance.addSingular(
      MatchEventNames.Message,
      handleCommsEvent
    );
  }, []);

  function handleCommsEvent(data: CommsEventProps) {
    const currentPlayer = MatchProvider.Instance.match.players.find(
      (p) => p.team === PlayerTeam.Blue
    )!;

    if (data.player.id === currentPlayer.id) {
      return;
    }

    messages.push(
      new DisplayableMessage(new Message(data.player, data.message), new Date())
    );

    setMessages(getFilteredMessages(messages));

    setTimeout(() => {
      setMessages(getFilteredMessages(messages));
    }, MESSAGE_DISPLAY_INTERVAL_SECS * 1000);
  }

  function getFilteredMessages(
    messages: DisplayableMessage[]
  ): DisplayableMessage[] {
    const now = new Date();

    return messages.filter(
      (message) =>
        (+now - +message.created) / 1000 < MESSAGE_DISPLAY_INTERVAL_SECS
    );
  }

  return (
    <>
      {messages.map((message) => (
        <MessageSprite message={message} key={message.created.valueOf()} />
      ))}
    </>
  );
}
