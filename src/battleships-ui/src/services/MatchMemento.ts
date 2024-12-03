import { toast } from "sonner";
import MatchProvider from "./MatchProvider/MatchProvider";
import { Match } from "@/models/Match";
import MatchMap from "@/models/MatchMap";
import { Player, PlayerTeam } from "@/models/Player";

// DESIGN PATTERN: 22. Memento
export class MatchCaretaker {
  private mementos: Memento[] = [];

  constructor() {}

  save() {
    this.mementos.push(MatchProvider.Instance.match.saveState());
  }

  restore() {
    const memento = this.mementos.pop();

    if (memento) {
      memento.restore(MatchProvider.Instance.match);
      toast.success("State restored");
    } else {
      toast.error("No more states to restore");
    }
  }
}

// Concrete state interface
export interface MatchState {
  players: Player[];
  duration: number;
  teamsMap: Map<PlayerTeam, MatchMap>;
}

// Memento interface
export interface Memento {
  restore(match: Match): void;
}

// MatchMemento class
export class MatchMemento implements Memento {
  private state: MatchState;

  constructor(state: MatchState) {
    this.state = state;
  }

  restore(match: Match): void {
    match.setState(this.state);
  }
}
