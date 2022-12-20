import {
  HubConnectionBuilder,
  HttpTransportType,
  HubConnection,
} from '@microsoft/signalr';
import { ResolvedFirstTurnClaimProps } from '../../components/MatchDisplay/Pregame/Pregame';
import { PlayerTeam } from '../../models/Player';
import LoggerService, { PatternTypes } from '../LoggerService/LoggerService';
import MatchProvider from '../MatchProvider/MatchProvider';
import MatchEventsCallbackHandler from '../MatchEventsCallbackHandler/MatchEventsObserver/MatchEventsCallbackHandler';
import {
  EnemyTurnStateEventHandler,
  IStateContext,
  IStateEventHandler,
  MatchSettingsStateEventHandler,
  NewMatchStateEventHandler,
  PlayerTurnStateEventHandler,
} from './MatchStateEventHandler/MatchStateEventHandler';

const HUB_ENDPOINT_URL = 'match-event-hub/';

export default class ConnectionMediatorService
  extends MatchEventsCallbackHandler
  implements IStateContext
{
  private _connection: HubConnection;
  private _statefulEventHandler: IStateEventHandler;

  private static _instance: ConnectionMediatorService;

  private static _loggerSingleton = LoggerService.Instance.getLogger(
    PatternTypes.Singleton
  );
  private _loggerState = LoggerService.Instance.getLogger(PatternTypes.State);

  private constructor() {
    super();

    this._connection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_BASE_URL + HUB_ENDPOINT_URL, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    this._connection.start();

    this._connection.onclose(async () => {
      await this.start();
    });

    this._connection.on('ReceiveEvent', (event: MatchEventNames, data: any) => {
      this.notify(event, data);
    });

    this._statefulEventHandler = new NewMatchStateEventHandler(
      this,
      this.getEventSenderFunc()
    );

    this.initStateTransitionObservers();
  }

  setStatefulEventHandler(statefulEventHandler: IStateEventHandler): void {
    this._loggerState.log(
      `State transition FROM ${this._statefulEventHandler.getName()} TO ${statefulEventHandler.getName()}`
    );

    if (this._statefulEventHandler.isTransitionPossible(statefulEventHandler)) {
      this._loggerState.log('State transition SUCCESSFUL');
      this._statefulEventHandler = statefulEventHandler;
    } else {
      this._loggerState.log('State transition FAILED');
    }
  }

  public static get Instance(): ConnectionMediatorService {
    this._loggerSingleton.log(
      `Singleton ConnectionMediatorService getting ${
        !this._instance ? 'NEW' : 'EXISTING'
      } instance`
    );

    this._instance ??= new ConnectionMediatorService();

    return this._instance;
  }

  public async sendEvent(event: MatchEventNames, data: any = {}) {
    await this.handleSendEvent(event, data);
  }

  private initStateTransitionObservers(): void {
    this.addSingular(MatchEventNames.SecondPlayerJoinedConfirmation, (_) => {
      this.setStatefulEventHandler(
        new MatchSettingsStateEventHandler(this, this.getEventSenderFunc())
      );
    });

    this.addSingular(
      MatchEventNames.ResolvedFirstTurnClaim,
      (data: ResolvedFirstTurnClaimProps) => {
        const currentPlayer = MatchProvider.Instance.match.players.find(
          (player) => player.team === PlayerTeam.Blue
        )!;
        const enemyPlayer = MatchProvider.Instance.match.players.find(
          (player) => player.team === PlayerTeam.Red
        )!;

        if (data.winnerPlayerId === currentPlayer.id) {
          this.setStatefulEventHandler(
            new PlayerTurnStateEventHandler(this, this.getEventSenderFunc())
          );
        } else if (data.winnerPlayerId === enemyPlayer.id) {
          this.setStatefulEventHandler(
            new EnemyTurnStateEventHandler(this, this.getEventSenderFunc())
          );
        }
      }
    );
  }

  private getEventSenderFunc(): (
    event: MatchEventNames,
    data: any
  ) => Promise<void> {
    return (event: MatchEventNames, data: any) =>
      this._connection.send('PropagateEvent', event, data);
  }

  private async handleSendEvent(event: MatchEventNames, data: any = {}) {
    try {
      await this._statefulEventHandler.sendEvent(event, data);
    } catch (err) {
      setTimeout(() => this.sendEvent(event, data), 1000);
    }
  }

  private async start() {
    try {
      await this._connection.start();
    } catch (err) {
      setTimeout(this.start, 1000);
    }
  }
}

export enum MatchEventNames {
  NewMatch,
  MatchCreated,
  PlayerJoined,
  SecondPlayerJoinedConfirmation,
  PlayerLockedInSettings,
  PlayerUpdatedMatchSettings,
  AttackPerformed,
  MatchStarted,
  PlayerFirstTurnClaim,
  ResolvedFirstTurnClaim,
  Message,
}
