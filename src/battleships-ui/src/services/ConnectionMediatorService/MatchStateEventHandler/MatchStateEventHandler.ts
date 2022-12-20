import LoggerService, { PatternTypes } from '../../LoggerService/LoggerService';
import { MatchEventNames } from '../ConnectionMediatorService';

export interface IStateContext {
  setStatefulEventHandler(stateFilter: IStateEventHandler): void;
}
export interface IStateEventHandler {
  sendEvent(event: number, data: any): void;
  isTransitionPossible(next: IStateEventHandler): boolean;
  getName(): string;
}

export abstract class MatchStateEventHandler implements IStateEventHandler {
  protected _logger = LoggerService.Instance.getLogger(PatternTypes.State);

  constructor(
    protected _context: IStateContext,
    private _sendFunction: (event: MatchEventNames, data: any) => Promise<void>
  ) {}

  abstract isTransitionPossible(next: IStateEventHandler): boolean;
  abstract isEventAllowed(event: MatchEventNames): boolean;
  abstract getName(): string;

  sendEvent(event: MatchEventNames, data: any): Promise<void> {
    if (!this.isEventAllowed(event)) {
      this._logger.log(
        `State ${this.getName()}: event ${event.toString()} sending FAILED`
      );

      return Promise.resolve();
    }

    return this._sendFunction(event, data);
  }
}

export class NewMatchStateEventHandler extends MatchStateEventHandler {
  isTransitionPossible(next: IStateEventHandler): boolean {
    return next instanceof MatchSettingsStateEventHandler;
  }

  isEventAllowed(event: MatchEventNames): boolean {
    const eventWhiteList = [
      MatchEventNames.NewMatch,
      MatchEventNames.PlayerJoined,
      MatchEventNames.SecondPlayerJoinedConfirmation,
      MatchEventNames.Message,
    ];

    return eventWhiteList.includes(event);
  }

  getName(): string {
    return NewMatchStateEventHandler.name;
  }
}

export class MatchSettingsStateEventHandler extends MatchStateEventHandler {
  isTransitionPossible(next: IStateEventHandler): boolean {
    return (
      next instanceof PlayerTurnStateEventHandler ||
      next instanceof EnemyTurnStateEventHandler
    );
  }

  isEventAllowed(event: MatchEventNames): boolean {
    const eventWhiteList = [
      MatchEventNames.PlayerUpdatedMatchSettings,
      MatchEventNames.PlayerLockedInSettings,
      MatchEventNames.MatchStarted,
      MatchEventNames.PlayerFirstTurnClaim,
      MatchEventNames.ResolvedFirstTurnClaim,
      MatchEventNames.Message,
    ];

    return eventWhiteList.includes(event);
  }

  getName(): string {
    return MatchSettingsStateEventHandler.name;
  }
}

export class PlayerTurnStateEventHandler extends MatchStateEventHandler {
  isTransitionPossible(next: IStateEventHandler): boolean {
    return next instanceof EnemyTurnStateEventHandler;
  }

  isEventAllowed(event: MatchEventNames): boolean {
    const eventWhiteList = [
      MatchEventNames.AttackPerformed,
      MatchEventNames.Message,
    ];

    return eventWhiteList.includes(event);
  }

  getName(): string {
    return PlayerTurnStateEventHandler.name;
  }
}

export class EnemyTurnStateEventHandler extends MatchStateEventHandler {
  isTransitionPossible(next: IStateEventHandler): boolean {
    return next instanceof PlayerTurnStateEventHandler;
  }

  isEventAllowed(event: MatchEventNames): boolean {
    const eventWhiteList = [MatchEventNames.Message];

    return eventWhiteList.includes(event);
  }

  getName(): string {
    return EnemyTurnStateEventHandler.name;
  }
}
