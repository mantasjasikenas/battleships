import { PlayerService } from "@/services/PlayerService/PlayerService";
import { AmmoType } from "../../../models/Ammo";
import { invertTeam, Player, PlayerTeam } from "../../../models/Player";
import HubConnectionService, {
  MatchEventNames,
} from "../../HubConnectionService/HubConnectionService";
import MatchProvider from "../../MatchProvider/MatchProvider";
import { MapTile } from "@/models/MatchMap";
import { toast } from "sonner";

export interface CommsEventProps {
  player: Player;
  message: string;
}

export interface IInterpreter {
  interpret(input: string): void;
}

export class Interpreter implements IInterpreter {
  interpret(input: string): void {
    const tokens = input
      .trim()
      .split(" ")
      .filter((token) => token.length > 0);

    if (!tokens[0].startsWith("/")) {
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
      case "/attack": {
        return this.tryResolveAttackCommandExpression(tokens);
      }
      case "/place-ship": {
        return this.tryResolvePlaceCommandExpression(tokens);
      }
      case "/undo": {
        return this.tryResolveUndoCommandExpression(tokens);
      }
      case "/msg": {
        return this.tryResolveMessageCommandExpression(tokens);
      }
      default: {
        toast.error("No such command");
        return undefined;
      }
    }
  }
  private tryResolvePlaceCommandExpression(
    tokens: string[],
  ): (() => void) | undefined {
    if (tokens.length < 4) {
      toast.error("missing parrameters");
      return undefined;
    }

    const executable = this.getPlaceCommandExecutable();

    return () =>
      executable(Number(tokens[2]), Number(tokens[3]), Number(tokens[1]));
  }

  private tryResolveUndoCommandExpression(
    tokens: string[],
  ): (() => void) | undefined {
    if (tokens.length < 1) {
      toast.error("missing parrameters");
      return undefined;
    }

    const executable = this.getUndoCommandExecutable();

    return () => executable();
  }

  private tryResolveAttackCommandExpression(
    tokens: string[],
  ): (() => void) | undefined {
    if (tokens.length < 4) {
      toast.error("missing parrameters");
      return undefined;
    }

    const ammoType = this.tryResolveAmmoType(tokens[1]);

    if (ammoType == null) {
      toast.error("Ammo type not found");
      return undefined;
    }

    const executable = this.getAttackCommandExecutable();

    return () => executable(Number(tokens[2]), Number(tokens[3]), ammoType);
  }

  private tryResolveMessageCommandExpression(
    tokens: string[],
  ): (() => void) | undefined {
    if (tokens.length < 2) {
      return undefined;
    }

    const messageTokens = tokens.splice(1);

    const message = messageTokens.join(" ");

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
    alignment: number,
  ) => void {
    return (posX: number, posY: number, alignment: number) => {
      const currentPlayerId = PlayerService.getFromSessionStorage()!.id;
      const currentPlayer = MatchProvider.getPlayer(currentPlayerId)!;

      if (!currentPlayer) {
        toast.error("Player not found");
        return;
      }
      if (alignment !== 0 && alignment !== 1) {
        toast.error("No such alignment");
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

  private getUndoCommandExecutable(): () => void {
    return () => {
      const currentPlayerId = PlayerService.getFromSessionStorage()!.id;
      const currentPlayer = MatchProvider.getPlayer(currentPlayerId)!;

      if (!currentPlayer) {
        toast.error("Player not found");
        return;
      }

      const data: any = {
        userId: currentPlayer.id,
      };

      HubConnectionService.Instance.sendEvent(
        MatchEventNames.UndoCommand,
        data,
      );
    };
  }
  private getAttackCommandExecutable(): (
    posX: number,
    posY: number,
    ammoType: AmmoType,
  ) => void {
    return (posX: number, posY: number, ammoType: AmmoType) => {
      const match = MatchProvider.Instance.match;
      const currentPlayerId = PlayerService.getFromSessionStorage()!.id;
      const currentPlayer = MatchProvider.getPlayer(currentPlayerId)!;
      const currentPlayerTeam = currentPlayer.team;
      const enemyTeam = invertTeam(currentPlayerTeam);
      const enemiesTeamMap = match.teamsMap.get(enemyTeam)!;

      if (!currentPlayer || !enemiesTeamMap) {
        toast.error("Player or enemie not found");
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
        data,
      );
    };
  }

  private getMessageCommandExecutable(): (message: string) => void {
    return (message: string) => {
      const player = MatchProvider.Instance.match.players.find(
        (p) => p.team === PlayerTeam.FirstTeam,
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
