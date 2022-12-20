import { Ammo } from '../Ammo';
import { MapTile } from '../MatchMap';

export abstract class PlayerTurn {}

export class AttackTurn extends PlayerTurn {
  ammo!: Ammo;
  tile!: MapTile;
}
