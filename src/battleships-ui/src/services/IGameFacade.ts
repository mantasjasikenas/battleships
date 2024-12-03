import { MatchEventNames } from "./HubConnectionService/HubConnectionService";
import { Player, PlayerTeam } from "@/models/Player";
import { Match } from "@/models/Match";
import MatchMap from "@/models/MatchMap";

export interface IGameFacade {
  addEventObserver(event: MatchEventNames, action: (data: any) => void): void;
  addSingularEventObserver(
    event: MatchEventNames,
    action: (data: any) => void,
  ): void;
  addEventObservers(
    events: Partial<{ [key in MatchEventNames]: (data: any) => void }>,
    isSingular: boolean,
  ): void;
  removeEventObservers(events: MatchEventNames[]): void;
  removeEventObserver(event: MatchEventNames): void;
  sendEvent(event: MatchEventNames, data: any): Promise<void>;
  getPlayerFromSessionStorage(): Player | undefined;
  getMatch(): Match;
  getMatchPlayer(id: number): Player | undefined;
  getMatchTeamPlayers(team: PlayerTeam): Player[];
  getTeamMap(team: PlayerTeam): MatchMap | undefined;
  removePlayerFromMatch(playerId: number): void;
  resetMatch(): void;
  destroyAllShips(sender: Player, attackedTeam: PlayerTeam): boolean;
  saveMatchState(): void;
  restoreMatchState(): void;
}
