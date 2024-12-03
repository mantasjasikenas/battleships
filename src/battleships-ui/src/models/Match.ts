import { Memento, MatchState, MatchMemento } from "@/services/MatchMemento";
import MatchMap from "./MatchMap";
import MatchSettings from "./MatchSettings";
import { Player, PlayerTeam } from "./Player";
import { AmmoCollection } from "./Ships/iterators/AmmoCollection";

export class Match {
  name: string = "New Match";
  isPregame: boolean = true;
  players: Player[] = [];
  mapSize: number = 10;
  duration: number = 600;
  teamsMap: Map<PlayerTeam, MatchMap> = new Map();
  settings: MatchSettings = new MatchSettings();
  availableAmmoTypes: AmmoCollection = new AmmoCollection();

  saveState(): Memento {
    const state: MatchState = {
      players: this.players.map((player) => player.clone()),
      duration: this.duration,
      teamsMap: new Map(
        Array.from(this.teamsMap.entries()).map(([team, map]) => [
          team,
          map.clone(),
        ]),
      ),
    };

    return new MatchMemento(state);
  }

  setState(state: MatchState) {
    this.players = state.players;
    this.duration = state.duration;
    this.teamsMap = state.teamsMap;
  }
}
