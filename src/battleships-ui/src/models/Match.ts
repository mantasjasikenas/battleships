import MatchMap from "./MatchMap";
import MatchSettings from "./MatchSettings";
import { Player, PlayerTeam } from "./Player";
import {
  AmmoCollection,
} from "./Ships/iterators/AmmoCollection";

export class Match {
  name: string = "New Match";
  isPregame: boolean = true;
  players: Player[] = [];
  mapSize: number = 10;
  duration: number = 600;
  teamsMap: Map<PlayerTeam, MatchMap> = new Map();
  settings: MatchSettings = new MatchSettings();
  availableAmmoTypes: AmmoCollection = new AmmoCollection();
}
