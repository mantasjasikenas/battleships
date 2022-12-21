import { AmmoType } from '../../../models/Ammo';
import { Player, PlayerTeam } from '../../../models/Player';
import { AttackTurnEventProps } from '../../AttackHandlerService/AttackHandlerService';
import HubConnectionService, {
  MatchEventNames,
} from '../../HubConnectionService/HubConnectionService';
import MatchProvider from '../../MatchProvider/MatchProvider';

const AsciiEmojiParser = require('ascii-emoji-parser');

export interface CommsEventProps {
  player: Player;
  message: string;
}

export interface IInterpreter {
  interpret(input: string): void;
}

export class Interpreter implements IInterpreter {
  private emojiParser = new AsciiEmojiParser(':');

  interpret(input: string): void {
    const tokens = input
      .trim()
      .split(' ')
      .filter((token) => token.length > 0);

    if (!tokens[0].startsWith('/')) {
      return;
    }

    const executable = this.tryResolve(tokens);

    if (!executable) {
      return;
    }

    executable();
  }

  private tryResolve(tokens: string[]): (() => void) | undefined {
    switch (tokens[0]) {
      case '/attack': {
        return this.tryResolveAttackCommandExpression(tokens);
      }
      case '/emote': {
        return this.tryResolveEmoteCommandExpression(tokens);
      }
      case '/msg': {
        return this.tryResolveMessageCommandExpression(tokens);
      }
      default: {
        return undefined;
      }
    }
  }

  private tryResolveAttackCommandExpression(
    tokens: string[]
  ): (() => void) | undefined {
    if (tokens.length < 4) {
      return undefined;
    }

    const ammoType = this.tryResolveAmmoType(tokens[1]);

    if (ammoType == null) {
      return undefined;
    }

    const executable = this.getAttackCommandExecutable();

    return () => executable(Number(tokens[2]), Number(tokens[3]), ammoType);
  }

  private tryResolveEmoteCommandExpression(
    tokens: string[]
  ): (() => void) | undefined {
    if (tokens.length < 2) {
      return undefined;
    }

    const pureTokenValue = tokens[1].substring(1, tokens[1].length - 1);

    if (!AsciiEmojiParser.getKeywords().includes(pureTokenValue)) {
      return undefined;
    }

    const emote = this.emojiParser.parse(tokens[1]);

    const executable = this.getEmoteCommandExecutable();

    return () => executable(emote);
  }

  private tryResolveMessageCommandExpression(
    tokens: string[]
  ): (() => void) | undefined {
    if (tokens.length < 2) {
      return undefined;
    }

    const messageTokens = tokens.splice(1);

    const message = messageTokens.join(' ');

    tokens.push(...messageTokens); // undo side-effects

    const executable = this.getMessageCommandExecutable();

    return () => executable(message);
  }

  private tryResolveAmmoType(token: string): AmmoType | undefined {
    const index = parseInt(token, 10);

    if (!Number.isInteger(index) || !AmmoType[index]) {
      return undefined;
    }

    return index;
  }

  private getAttackCommandExecutable(): (
    posX: number,
    posY: number,
    ammoType: AmmoType
  ) => void {
    return (posX: number, posY: number, ammoType: AmmoType) => {
      const match = MatchProvider.Instance.match;

      const player = match.players.find((p) => p.team === PlayerTeam.Blue)!;
      const enemy = match.players.find((p) => p.team === PlayerTeam.Red)!;

      if (!player || !enemy) {
        return;
      }

      const tile = enemy.map.tiles[posX][posY];

      const data: AttackTurnEventProps = {
        offencePlayerId: player.id,
        defencePlayerId: enemy.id,
        tile: tile,
        ammoType: ammoType,
      };

      HubConnectionService.Instance.sendEvent(
        MatchEventNames.AttackPerformed,
        data
      );
    };
  }

  private getEmoteCommandExecutable(): (emote: string) => void {
    return (emote: string) => {
      const player = MatchProvider.Instance.match.players.find(
        (p) => p.team === PlayerTeam.Blue
      )!;

      if (!player) {
        return;
      }

      const data: CommsEventProps = {
        player: player,
        message: emote,
      };

      HubConnectionService.Instance.sendEvent(MatchEventNames.Message, data);
    };
  }

  private getMessageCommandExecutable(): (message: string) => void {
    return (message: string) => {
      const player = MatchProvider.Instance.match.players.find(
        (p) => p.team === PlayerTeam.Blue
      )!;

      if (!player) {
        return;
      }

      const data: CommsEventProps = {
        player: player,
        message: message,
      };

      HubConnectionService.Instance.sendEvent(MatchEventNames.Message, data);
    };
  }
}
