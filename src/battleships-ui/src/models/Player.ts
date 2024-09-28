import { Airship } from './Airships/Airship';
import MatchMap from './MatchMap';
import Ship from './Ships/Ship';
import { AttackTurn } from './Turns/AttackTurn';
import { MovementTurn } from './Turns/MovementTurn';

export enum PlayerTeam {
  FirstTeam = 'FirstTeam',
  SecondTeam = 'SecondTeam',
}

export class Player {
  id: number;
  name: string;
  team: PlayerTeam;
  airships: Airship[];
  movementTurns: MovementTurn[] = [];
  attackTurns: AttackTurn[] = [];
  turnOverDraw = 0;
  placedShips = 0;

  constructor(object: Partial<Player>) {
    this.id = object.id ?? Math.round(Math.random() * 1000);
    this.name = object.name ?? 'New player';
    this.team = !!object.team ? PlayerTeam[object.team] : PlayerTeam.FirstTeam;
    this.airships = object.airships ?? [];
    this.attackTurns = [];
  }

  static mapList(objects?: Partial<Player>[]): Player[] {
    if (objects == null) {
      return [];
    }

    return objects.map((object) => new Player(object));
  }

  public invertTeam() {
    this.team =
      this.team === PlayerTeam.FirstTeam
        ? PlayerTeam.SecondTeam
        : PlayerTeam.FirstTeam;
  }
}
