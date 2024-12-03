import MatchProvider from "@/services/MatchProvider/MatchProvider";
import { Ammo, AmmoType } from "./Ammo";
import MatchMap, { MapTile } from "./MatchMap";
import { ShipClass } from "./Ships/ShipClass";
import { ModularShipPart } from "./Ships/ShipPart";

class AttackInfo {
  static isAttackPossible(
    affectedClasses: ShipClass[],
    shipClass?: ShipClass,
  ): boolean {
    return shipClass != null && affectedClasses.includes(shipClass);
  }
  static isSurfaceAttackPossible(shipClass?: ShipClass) {
    return this.isAttackPossible(
      [
        ShipClass.Carrier,
        ShipClass.Battleship,
        ShipClass.Cruiser,
        ShipClass.Speedboat,
      ],
      shipClass,
    );
  }

  static isUnderwaterAttackPossible(shipClass?: ShipClass) {
    return this.isAttackPossible([ShipClass.Submarine], shipClass);
  }

  static baseAttack(tile: MapTile): void {
    tile.isAttacked = true;
  }

  static damageAttack(ammo: Ammo, tile: MapTile, _map: MatchMap): void {
    if (tile.shipPart) {
      const shipPart = tile.shipPart as ModularShipPart;

      shipPart.hp -= ammo.damage;

      if (shipPart.hp <= 0) {
        shipPart.hp = 0;
        shipPart.isDestroyed = true;
        tile.isShipPartDestroyed = true;
      }
    }
  }

  static cooldownAttack(
    ammo: Ammo,
    tile: MapTile,
    map: MatchMap,
    baseAttack: (ammo: Ammo, tile: MapTile, map: MatchMap) => void,
  ): void {
    baseAttack(ammo, tile, map);

    const player = MatchProvider.Instance.match.players[0];

    if (player.attackTurns.length > ammo.cooldown) {
      player.attackTurns.reverse().splice(0, ammo.cooldown).reverse();
    }
  }
}

// DESIGN PATTERN: 19. Chain Of Responsibility
export abstract class Handler implements attackStrategy {
  ammo: Ammo;
  tile: MapTile;
  map: MatchMap;
  nextComp: Handler | undefined;
  constructor(ammo: Ammo, tile: MapTile, map: MatchMap) {
    this.ammo = ammo;
    this.tile = tile;
    this.map = map;
  }
  setNext(comp: Handler): Handler {
    this.nextComp = comp;
    return comp;
  }
  abstract attack(): void;
  next(): void {
    if (this.nextComp) {
      this.nextComp.attack();
    }
  }
}

export interface attackStrategy {
  attack(): void;
  setNext(nextComp: Handler): Handler;
  next(): void;
}

// DESIGN PATTERN: 10. Adapter
export class AreaAttackAdapter extends Handler {
  private strategy: AreaStrategy;
  constructor(
    ammo: Ammo,
    tile: MapTile,
    map: MatchMap,
    strategy: AreaStrategy,
  ) {
    super(ammo, tile, map);
    this.strategy = strategy;
  }
  attack(): void {
    if (
      this.ammo.type === AmmoType.DepthCharge ||
      this.ammo.type === AmmoType.HighExplosive
    ) {
      this.strategy.SetBaseAttack(this.ammo);
      this.strategy.AreaAttack(this.ammo, this.tile, this.map);
    } else {
      this.next();
    }
  }
}

export class classicAttackHandler extends Handler {
  attack(): void {
    if (this.ammo.type === AmmoType.Classic) {
      AttackInfo.baseAttack(this.tile);

      if (this.tile.shipPart) {
        this.tile.shipPart.isDestroyed = true;
        this.tile.isShipPartDestroyed = true;
      }
    } else {
      this.next();
    }
  }
}

export class standardAttackHandler extends Handler {
  attack(): void {
    if (this.ammo.type === AmmoType.Standard) {
      AttackInfo.baseAttack(this.tile);

      if (!AttackInfo.isSurfaceAttackPossible(this.tile.shipPart?.shipClass)) {
        return;
      }
      AttackInfo.damageAttack(this.ammo, this.tile, this.map);
    } else {
      this.next();
    }
  }
}

export class armorPiercingAttackHandler extends Handler {
  attack(): void {
    if (this.ammo.type === AmmoType.ArmorPiercing) {
      const attack = () => {
        AttackInfo.baseAttack(this.tile);

        if (
          !AttackInfo.isSurfaceAttackPossible(this.tile.shipPart?.shipClass)
        ) {
          return;
        }

        AttackInfo.damageAttack(this.ammo, this.tile, this.map);
      };

      AttackInfo.cooldownAttack(this.ammo, this.tile, this.map, attack);
    } else {
      this.next();
    }
  }
}

export class AreaStrategy {
  attack = (_ammo: Ammo, _tile: MapTile, _map: MatchMap) => {};
  SetBaseAttack(ammo: Ammo): void {
    if (ammo.type === AmmoType.HighExplosive) {
      this.attack = (ammo: Ammo, tile: MapTile, map: MatchMap) => {
        AttackInfo.baseAttack(tile);

        if (!AttackInfo.isSurfaceAttackPossible(tile.shipPart?.shipClass)) {
          return;
        }

        AttackInfo.damageAttack(ammo, tile, map);
      };
    } else if (ammo.type === AmmoType.DepthCharge) {
      this.attack = (ammo: Ammo, tile: MapTile, map: MatchMap) => {
        AttackInfo.baseAttack(tile);

        if (!AttackInfo.isUnderwaterAttackPossible(tile.shipPart?.shipClass)) {
          return;
        }

        AttackInfo.damageAttack(ammo, tile, map);
      };
    }
  }
  AreaAttack(ammo: Ammo, tile: MapTile, map: MatchMap): void {
    for (
      let i = tile.x - (ammo.impactRadius - 1);
      i < tile.x + ammo.impactRadius;
      i++
    ) {
      for (
        let j = tile.y - (ammo.impactRadius - 1);
        j < tile.y + ammo.impactRadius;
        j++
      ) {
        if (i < 0 || i >= map.tiles.length || j < 0 || j >= map.tiles.length) {
          continue;
        }

        const tile = map.tiles[i][j];
        this.attack(ammo, tile, map);
      }
    }
  }
}
