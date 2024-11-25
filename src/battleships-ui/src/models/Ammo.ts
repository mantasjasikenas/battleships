import { AmmoReadyToFireState } from "./AmmoReadyToFireState";
import { AmmoState } from "./AmmoState";
import GameFacade from "@/services/GameFacade";
import { Player } from './Player';
import { AttackTurn } from "./Turns/AttackTurn";
import { MapTile } from "./MatchMap";

// non-Classic ammo types used only in "Ammo" gamemode
export enum AmmoType {
  Classic,
  Standard,
  ArmorPiercing,
  HighExplosive,
  DepthCharge,
}

export class Ammo {
  name!: string;
  type!: AmmoType;
  damage!: number;
  impactRadius!: number;
  cooldown!: number;
  count!: number;
  state: AmmoState = new AmmoReadyToFireState();

  onAttack(gameFacade: GameFacade, currentPlayer: Player, turn: AttackTurn, selectedTile: MapTile | null): void {
    this.state.onAttack(this, gameFacade, currentPlayer, turn, selectedTile);
  }

  static map(object: Partial<Ammo>, model = new Ammo()): Ammo {
    if (object == null) {
      return model;
    }

    model.name = object.name ?? 'Standard';
    model.type = object.type ?? AmmoType.Standard;
    model.damage = object.damage ?? 1;
    model.impactRadius = object.impactRadius ?? 1;
    model.cooldown = object.cooldown ?? 0;
    model.count = object.count ?? 999;

    return model;
  }

  static mapList(list: Ammo[] = []): Ammo[] {
    const result = list.map((item) => this.map(item));

    return result;
  }
}
