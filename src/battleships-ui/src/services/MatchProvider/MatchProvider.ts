import { PlayerTeam } from "@/models/Player";
import { Match } from "../../models/Match";

// DESIGN PATTERN: Singleton
export default class MatchProvider {
  match: Match;

  private static _instance: MatchProvider;

  private constructor() {
    this.match = new Match();
  }

  public static getPlayer(id: number) {
    return this.Instance.match.players.find((player) => player.id === id);
  }

  public static getTeamPlayers(team: PlayerTeam) {
    return this.Instance.match.players.filter((player) => player.team === team);
  }

  public static getTeamMap(team: PlayerTeam) {
    return this.Instance.match.teamsMap.get(team);
  }

  public static get Instance(): MatchProvider {
    MatchProvider._instance ??= new MatchProvider();

    return MatchProvider._instance;
  }

  public static reset() {
    MatchProvider._instance = new MatchProvider();
  }
}
