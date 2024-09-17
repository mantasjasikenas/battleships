import { Ammo } from './Ammo';
import MatchMap from './MatchMap';
import MatchSettings from './MatchSettings';
import { Player, PlayerTeam } from './Player';

export class Match {
  name: string;
  isPregame: boolean;
  players: Player[];
  teamsMap: Map<PlayerTeam, MatchMap> = new Map();
  settings: MatchSettings = new MatchSettings();
  availableAmmoTypes: Ammo[] = [];

  constructor(object?: Partial<Match>) {
    this.name = object?.name ?? 'New match';
    this.isPregame = object?.isPregame ?? true;
    this.players = Player.mapList(object?.players);
    this.settings = new MatchSettings(object?.settings);
    this.availableAmmoTypes = Ammo.mapList(object?.availableAmmoTypes);
  }
}
