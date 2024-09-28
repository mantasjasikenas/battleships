import {
  HubConnectionBuilder,
  HttpTransportType,
  HubConnection,
  LogLevel,
} from "@microsoft/signalr";
import MatchEventsCallbackHandler from "../MatchEventsCallbackHandler/MatchEventsObserver/MatchEventsCallbackHandler";

const HUB_ENDPOINT_URL = "match-event-hub/";

export default class HubConnectionService extends MatchEventsCallbackHandler {
  private _connection: HubConnection;

  private static _instance: HubConnectionService;

  private constructor() {
    super();

    this._connection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_REACT_APP_BASE_URL + HUB_ENDPOINT_URL, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this._connection.start();

    this._connection.onclose(async () => {
      await this.start();
    });

    this._connection.on("ReceiveEvent", (event: MatchEventNames, data: any) => {
      this.notify(event, data);
    });
  }

  public static get Instance(): HubConnectionService {
    this._instance ??= new HubConnectionService();

    return this._instance;
  }

  public async sendEvent(event: MatchEventNames, data: any = {}) {
    await this.handleSendEvent(event, data);
  }

  private async handleSendEvent(event: MatchEventNames, data: any = {}) {
    try {
      await this._connection.send("PropagateEvent", event, data);
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
  PlayerLockedInSettings,
  PlayerUpdatedMatchSettings,
  AttackPerformed,
  MatchStarted,
  Message,

  shipsPlaced,
  PlayerGaveUp,
  PlayerLeft,
  PlayerLeftLobby,
}
