import { Player, PlayerTeam } from "@/models/Player";
import HubConnectionService, {
  MatchEventNames,
} from "./HubConnectionService/HubConnectionService";
import { PlayerService } from "./PlayerService/PlayerService";
import { Match } from "@/models/Match";
import MatchProvider from "./MatchProvider/MatchProvider";
import { MatchService } from "./MatchService/MatchService";
import { MatchCaretaker } from "./MatchMemento";
import { IGameFacade } from "./IGameFacade";

// DESIGN PATTERN: 11. Facade
export default class GameFacade implements IGameFacade {
  private constructor() {
    this.matchCaretaker = new MatchCaretaker();
  }

  private static _instance: GameFacade;
  private matchCaretaker: MatchCaretaker;

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

  removePlayerFromMatch(playerId: number) {
    MatchService.removePlayerFromMatch(playerId);
  }

  resetMatch() {
    MatchProvider.reset();
    PlayerService.removeFromSessionStorage();
    HubConnectionService.Instance.clearAll();

    this.matchCaretaker = new MatchCaretaker();
  }

  destroyAllShips(sender: Player, attackedTeam: PlayerTeam): boolean {
    const attackedTeamMap = this.getTeamMap(attackedTeam)!;
    const tiles = attackedTeamMap.tiles;

    for (const row of tiles) {
      for (const tile of row) {
        if (tile.shipPart) {
          tile.isShipPartDestroyed = true;
        }
      }
    }

    return true;
  }

  public saveMatchState() {
    this.matchCaretaker.save();
  }

  public restoreMatchState() {
    this.matchCaretaker.restore();
  }
}
