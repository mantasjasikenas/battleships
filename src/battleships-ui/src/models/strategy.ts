import MatchProvider from "@/services/MatchProvider/MatchProvider";
import { Ammo } from "./Ammo";
import MatchMap, { MapTile } from "./MatchMap";
import { ShipClass } from "./Ships/ShipClass";
import { ModularShipPart } from "./Ships/ShipPart";

// DESIGN PATTERN: Strategy
export class Context {
  private static strategy: Strategy | undefined;

  public static setStrategy(strategy: Strategy) {
    this.strategy = strategy;
  }
  public static executeStrategy(ammo: Ammo, tile: MapTile, map: MatchMap) {
    this.strategy?.Attack(ammo, tile, map);
  }
}

export interface Strategy {
  Attack(ammo: Ammo, tile: MapTile, map: MatchMap): void;
}
export class classicAttackStrategy implements Strategy {
  Attack(ammo: Ammo, tile: MapTile, map: MatchMap): void {
    AttackInfo.baseAttack(tile);

    if (!!tile.shipPart) {
      tile.shipPart.isDestroyed = true;
      tile.isShipPartDestroyed = true;
    }
  }
}

export class standardAttackStrategy implements Strategy {
  Attack(ammo: Ammo, tile: MapTile, map: MatchMap): void {
    AttackInfo.baseAttack(tile);

    if (!AttackInfo.isSurfaceAttackPossible(tile.shipPart?.shipClass)) {
      return;
    }

    AttackInfo.damageAttack(ammo, tile, map);
  }
}

export class armorPiercingAttackStrategy implements Strategy {
  Attack(ammo: Ammo, tile: MapTile, map: MatchMap): void {
    const attack = () => {
      AttackInfo.baseAttack(tile);

      if (!AttackInfo.isSurfaceAttackPossible(tile.shipPart?.shipClass)) {
        return;
      }

      AttackInfo.damageAttack(ammo, tile, map);
    };

    AttackInfo.cooldownAttack(ammo, tile, map, attack);
  }
}

export class highExplosiveAttackStrategy implements Strategy {
  Attack(ammo: Ammo, tile: MapTile, map: MatchMap): void {
    const attack = (ammo: Ammo, tile: MapTile, map: MatchMap) => {
      AttackInfo.baseAttack(tile);

      if (!AttackInfo.isSurfaceAttackPossible(tile.shipPart?.shipClass)) {
        return;
      }

      AttackInfo.damageAttack(ammo, tile, map);
    };

    AttackInfo.areaAttack(ammo, tile, map, attack);
  }
}

export class depthChargeAttackStrategy implements Strategy {
  Attack(ammo: Ammo, tile: MapTile, map: MatchMap): void {
    const attack = (ammo: Ammo, tile: MapTile, map: MatchMap) => {
      AttackInfo.baseAttack(tile);

      if (!AttackInfo.isUnderwaterAttackPossible(tile.shipPart?.shipClass)) {
        return;
      }

      AttackInfo.damageAttack(ammo, tile, map);
    };

    AttackInfo.areaAttack(ammo, tile, map, attack);
  }
}

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

  static damageAttack(ammo: Ammo, tile: MapTile, map: MatchMap): void {
    if (!!tile.shipPart) {
      const shipPart = tile.shipPart as ModularShipPart;

      shipPart.hp -= ammo.damage;

      if (shipPart.hp <= 0) {
        shipPart.hp = 0;
        shipPart.isDestroyed = true;
        tile.isShipPartDestroyed = true;
      }
    }
  }

  static areaAttack(
    ammo: Ammo,
    tile: MapTile,
    map: MatchMap,
    baseAttack: (ammo: Ammo, tile: MapTile, map: MatchMap) => void,
  ): void {
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
        baseAttack(ammo, tile, map);
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
    } else {
      player.turnOverDraw += ammo.cooldown;
    }
  }
}
