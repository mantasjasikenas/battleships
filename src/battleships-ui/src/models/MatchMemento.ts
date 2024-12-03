import { Player, PlayerTeam } from "@/models/Player";
import MatchMap from "@/models/MatchMap";

// Concrete state interface
export interface MatchState {
  players: Player[];
  duration: number;
  teamsMap: Map<PlayerTeam, MatchMap>;
}

// Memento interface
export interface Memento {
  getState(): MatchState;
}

// MatchMemento class
export class MatchMemento implements Memento {
  private state: MatchState;

  constructor(state: MatchState) {
    this.state = state;
  }

  getState(): MatchState {
    return this.state;
  }
}
