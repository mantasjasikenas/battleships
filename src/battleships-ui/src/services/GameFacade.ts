import { Player, PlayerTeam } from "@/models/Player";
import HubConnectionService, {
  MatchEventNames,
} from "./HubConnectionService/HubConnectionService";
import { PlayerService } from "./PlayerService/PlayerService";
import { Match } from "@/models/Match";
import MatchProvider from "./MatchProvider/MatchProvider";
import { MatchService } from "./MatchService/MatchService";

// DESIGN PATTERN: 11. Facade
export default class GameFacade {
  private constructor() {}

  private static _instance: GameFacade;

  public static get Instance(): GameFacade {
    this._instance ??= new GameFacade();

    return this._instance;
  }

  addEventObserver(event: MatchEventNames, action: (data: any) => void) {
    HubConnectionService.Instance.add(event, action);
  }

  addSingularEventObserver(
    event: MatchEventNames,
    action: (data: any) => void,
  ) {
    HubConnectionService.Instance.addSingular(event, action);
  }

  addEventObservers(
    events: Partial<{ [key in MatchEventNames]: (data: any) => void }>,
    isSingular: boolean = false,
  ) {
    Object.entries(events).forEach(([event, action]) => {
      if (action) {
        const matchEvent = event as unknown as MatchEventNames;

        if (isSingular) {
          this.addSingularEventObserver(matchEvent, action);
        } else {
          this.addEventObserver(matchEvent, action);
        }
      }
    });
  }

  removeEventObservers(events: MatchEventNames[]) {
    events.forEach((event) => {
      this.removeEventObserver(event);
    });
  }

  removeEventObserver(event: MatchEventNames): void {
    HubConnectionService.Instance.remove(event);
  }

  async sendEvent(event: MatchEventNames, data: any = {}) {
    await HubConnectionService.Instance.sendEvent(event, data);
  }

  getPlayerFromSessionStorage(): Player | undefined {
    return PlayerService.getFromSessionStorage();
  }

  getMatch(): Match {
    return MatchProvider.Instance.match;
  }

  getMatchPlayer(id: number) {
    return MatchProvider.getPlayer(id);
  }

  getMatchTeamPlayers(team: PlayerTeam): Player[] {
    return MatchProvider.getTeamPlayers(team);
  }

  getTeamMap(team: PlayerTeam) {
    return MatchProvider.getTeamMap(team);
  }

  remotePlayerFromMatch(playerId: number) {
    MatchService.removePlayerFromMatch(playerId);
  }

  resetMatch() {
    MatchProvider.reset();
    PlayerService.removeFromSessionStorage();
    HubConnectionService.Instance.clearAll();
  }
}
