import { PlayerService } from '@/services/PlayerService/PlayerService';
import { AmmoType } from '../../../models/Ammo';
import { invertTeam, Player, PlayerTeam } from '../../../models/Player';
import HubConnectionService, {
  MatchEventNames,
} from '../../HubConnectionService/HubConnectionService';
import MatchProvider from '../../MatchProvider/MatchProvider';
import AsciiEmojiParser  from 'ascii-emoji-parser';
import { MapTile } from '@/models/MatchMap';

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
      case '/place-ship': {
        return this.tryResolvePlaceCommandExpression(tokens);
      }
      case '/undo': {
        return this.tryResolveUndoCommandExpression(tokens);
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
  private tryResolvePlaceCommandExpression(
    tokens: string[]
  ): (() => void) | undefined {
    if (tokens.length < 4) {
      return undefined;
    }

    const executable = this.getPlaceCommandExecutable();

    return () => executable(Number(tokens[2]), Number(tokens[3]), Number(tokens[1]));
  }

  private tryResolveUndoCommandExpression(
    tokens: string[]
  ): (() => void) | undefined {
    if (tokens.length < 1) {
      return undefined;
    }

    const executable = this.getUndoCommandExecutable();

    return () => executable();
  }

  private tryResolveAttackCommandExpression(tokens: string[]): (() => void) | undefined {
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
  private getPlaceCommandExecutable(): (
    posX: number,
    posY: number,
    alignment: number
  ) => void {
    return (posX: number, posY: number, alignment: number) => {
      const currentPlayerId = PlayerService.getFromSessionStorage()!!.id;
      const currentPlayer = MatchProvider.getPlayer(currentPlayerId)!;

      if (!currentPlayer) {
        return;
      }

      HubConnectionService.Instance.sendEvent(MatchEventNames.ShipsPlaced, {
        placerId: currentPlayer.id,
        placerTeam: currentPlayer.team,
        tile: new MapTile(posX, posY),
        alignment: alignment,
        ships: currentPlayer.ships,
      });
    };
  }

  private getUndoCommandExecutable():() => void{
    return () => {
      const currentPlayerId = PlayerService.getFromSessionStorage()!!.id;
      const currentPlayer = MatchProvider.getPlayer(currentPlayerId)!;

      if (!currentPlayer) {
        return;
      }

      const data: any = {
        userId: currentPlayer.id,
      };

      HubConnectionService.Instance.sendEvent(MatchEventNames.UndoCommand, data);
    };
  }
  private getAttackCommandExecutable(): (
    posX: number,
    posY: number,
    ammoType: AmmoType
  ) => void {
    return (posX: number, posY: number, ammoType: AmmoType) => {
      const match = MatchProvider.Instance.match;
      const currentPlayerId = PlayerService.getFromSessionStorage()!!.id;
      const currentPlayer = MatchProvider.getPlayer(currentPlayerId)!;
      const currentPlayerTeam = currentPlayer.team;
      const enemyTeam = invertTeam(currentPlayerTeam);
      const enemiesTeamMap = match.teamsMap.get(enemyTeam)!;

      if (!currentPlayer || !enemiesTeamMap) {
        return;
      }

      const tile = enemiesTeamMap?.tiles[posX][posY];

      const data: any = {
        attackerId: currentPlayer.id,
        attackerTeam: currentPlayerTeam,
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
        (p) => p.team === PlayerTeam.FirstTeam
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
        (p) => p.team === PlayerTeam.FirstTeam
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
