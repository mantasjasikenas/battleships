import { Ammo } from "./Ammo";
import MatchMap from "./MatchMap";
import MatchSettings from "./MatchSettings";
import { Player, PlayerTeam } from "./Player";
import { ShipPart } from "./Ships/ShipPart";

export class Match {
  name: string;
  isPregame: boolean;
  players: Player[];
  mapSize: number = 10;
  duration: number = 600;
  teamsMap: Map<PlayerTeam, MatchMap> = new Map();
  settings: MatchSettings = new MatchSettings();
  availableAmmoTypes: Ammo[] = [];

  constructor(object?: Partial<Match>) {
    this.name = object?.name ?? "New match";
    this.isPregame = object?.isPregame ?? true;
    this.players = Player.mapList(object?.players);
    this.settings = new MatchSettings(object?.settings);
    this.availableAmmoTypes = Ammo.mapList(object?.availableAmmoTypes);
    this.teamsMap = new Map<PlayerTeam, MatchMap>();
    this.mapSize = object?.mapSize ?? this.mapSize;
    this.duration = object?.duration ?? this.duration;
  }
}
