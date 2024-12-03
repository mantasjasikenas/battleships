import GameFacade from "./GameFacade";
import { MatchEventNames } from "./HubConnectionService/HubConnectionService";
import { Player, PlayerTeam } from "@/models/Player";
import { IGameFacade } from "./IGameFacade";

// DESIGN PATTERN: 18. Proxy
class GameFacadeProxy implements IGameFacade {
  private static instance: GameFacadeProxy;
  private gameFacade: GameFacade | null = null;

  private constructor() {}

  public static get Instance(): GameFacadeProxy {
    return (GameFacadeProxy.instance ??= new GameFacadeProxy());
  }

  // Lazy initialization
  private getGameFacade(): GameFacade {
    return (this.gameFacade ??= GameFacade.Instance);
  }

  // Access control
  private checkAccess(player: Player): boolean {
    if (player.name === "admin") {
      return true;
    }

    return false;
  }

  public destroyAllShips(sender: Player, attackedTeam: PlayerTeam): boolean {
    if (this.checkAccess(sender)) {
      return this.getGameFacade().destroyAllShips(sender, attackedTeam);
    }

    return false;
  }

  public resetMatch() {
    this.getGameFacade().resetMatch();
  }

  public getMatch() {
    return this.getGameFacade().getMatch();
  }

  public getPlayerFromSessionStorage() {
    return this.getGameFacade().getPlayerFromSessionStorage();
  }

  public getMatchPlayer(playerId: number) {
    return this.getGameFacade().getMatchPlayer(playerId);
  }

  public getMatchTeamPlayers(team: PlayerTeam) {
    return this.getGameFacade().getMatchTeamPlayers(team);
  }

  public getTeamMap(team: PlayerTeam) {
    return this.getGameFacade().getTeamMap(team);
  }

  public addEventObserver(
    event: MatchEventNames,
    action: (data: any) => void,
  ): void {
    this.getGameFacade().addEventObserver(event, action);
  }

  public addSingularEventObserver(
    event: MatchEventNames,
    action: (data: any) => void,
  ): void {
    this.getGameFacade().addSingularEventObserver(event, action);
  }

  public removeEventObserver(event: MatchEventNames): void {
    this.getGameFacade().removeEventObserver(event);
  }

  public async sendEvent(event: MatchEventNames, data: any = {}) {
    this.getGameFacade().sendEvent(event, data);
  }

  public addEventObservers(observers: any, isSingular: boolean) {
    this.getGameFacade().addEventObservers(observers, isSingular);
  }

  public removeEventObservers(eventNames: MatchEventNames[]) {
    this.getGameFacade().removeEventObservers(eventNames);
  }

  public removePlayerFromMatch(playerId: number) {
    this.getGameFacade().removePlayerFromMatch(playerId);
  }

  public saveMatchState() {
    this.getGameFacade().saveMatchState();
  }

  public restoreMatchState() {
    this.getGameFacade().restoreMatchState();
  }
}

export default GameFacadeProxy;
