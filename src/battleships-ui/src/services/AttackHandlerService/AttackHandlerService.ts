import { Ammo, AmmoType } from '../../models/Ammo';
import MatchMap, { MapTile } from '../../models/MatchMap';
import { PlayerTeam } from '../../models/Player';
import { ShipClass } from '../../models/Ships/ShipClass';
import { ModularShipPart } from '../../models/Ships/ShipPart';
import MatchProvider from '../MatchProvider/MatchProvider';

export interface AttackTurnEventProps {
  attackerId: number;
  attackerTeam: PlayerTeam;
  tile: MapTile;
  ammoType: AmmoType;
}
export class AttackHandlerService {
  public static getAttackByAmmo(
    ammoType: AmmoType,
    availableAmmoTypes: Ammo[]
  ): (tile: MapTile, map: MatchMap) => void {
    const ammo = availableAmmoTypes.find((ammo) => ammo.type === ammoType);

    if (!ammo) {
      console.error(
        `Unable to resolve attack by type ${ammoType}. Available types are: ${JSON.stringify(
          availableAmmoTypes
        )}`
      );

      return () => {};
    }

    switch (ammoType) {
      case AmmoType.Classic:
        return (tile: MapTile, map: MatchMap) =>
          this.classicAttack(ammo!, tile, map);
      case AmmoType.Standard:
        return (tile: MapTile, map: MatchMap) =>
          this.standardAttack(ammo!, tile, map);
      case AmmoType.ArmorPiercing:
        return (tile: MapTile, map: MatchMap) =>
          this.armorPiercingAttack(ammo!, tile, map);
      case AmmoType.HighExplosive:
        return (tile: MapTile, map: MatchMap) =>
          this.highExplosiveAttack(ammo!, tile, map);
      case AmmoType.DepthCharge:
        return (tile: MapTile, map: MatchMap) =>
          this.depthChargeAttack(ammo!, tile, map);
    }
  }

  private static classicAttack(ammo: Ammo, tile: MapTile, map: MatchMap): void {
    this.baseAttack(tile);

    if (!!tile.shipPart) {
      tile.shipPart.isDestroyed = true;
      tile.isShipPartDestroyed = true;
    }
  }

  private static standardAttack(
    ammo: Ammo,
    tile: MapTile,
    map: MatchMap
  ): void {
    this.baseAttack(tile);

    if (!this.isSurfaceAttackPossible(tile.shipPart?.shipClass)) {
      return;
    }

    this.damageAttack(ammo, tile, map);
  }

  private static armorPiercingAttack(
    ammo: Ammo,
    tile: MapTile,
    map: MatchMap
  ): void {
    const attack = () => {
      this.baseAttack(tile);

      if (!this.isSurfaceAttackPossible(tile.shipPart?.shipClass)) {
        return;
      }

      this.damageAttack(ammo, tile, map);
    };

    this.cooldownAttack(ammo, tile, map, attack);
  }

  private static highExplosiveAttack(
    ammo: Ammo,
    tile: MapTile,
    map: MatchMap
  ): void {
    const attack = (ammo: Ammo, tile: MapTile, map: MatchMap) => {
      this.baseAttack(tile);

      if (!this.isSurfaceAttackPossible(tile.shipPart?.shipClass)) {
        return;
      }

      this.damageAttack(ammo, tile, map);
    };

    this.areaAttack(ammo, tile, map, attack);
  }

  private static depthChargeAttack(
    ammo: Ammo,
    tile: MapTile,
    map: MatchMap
  ): void {
    const attack = (ammo: Ammo, tile: MapTile, map: MatchMap) => {
      this.baseAttack(tile);

      if (!this.isUnderwaterAttackPossible(tile.shipPart?.shipClass)) {
        return;
      }

      this.damageAttack(ammo, tile, map);
    };

    this.areaAttack(ammo, tile, map, attack);
  }

  private static isAttackPossible(
    affectedClasses: ShipClass[],
    shipClass?: ShipClass
  ): boolean {
    return shipClass != null && affectedClasses.includes(shipClass);
  }

  private static isSurfaceAttackPossible(shipClass?: ShipClass) {
    return this.isAttackPossible(
      [
        ShipClass.Carrier,
        ShipClass.Battleship,
        ShipClass.Cruiser,
        ShipClass.Speedboat,
      ],
      shipClass
    );
  }

  private static isUnderwaterAttackPossible(shipClass?: ShipClass) {
    return this.isAttackPossible([ShipClass.Submarine], shipClass);
  }

  private static baseAttack(tile: MapTile): void {
    tile.isAttacked = true;
  }

  private static damageAttack(ammo: Ammo, tile: MapTile, map: MatchMap): void {
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

  private static areaAttack(
    ammo: Ammo,
    tile: MapTile,
    map: MatchMap,
    baseAttack: (ammo: Ammo, tile: MapTile, map: MatchMap) => void
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

  private static cooldownAttack(
    ammo: Ammo,
    tile: MapTile,
    map: MatchMap,
    baseAttack: (ammo: Ammo, tile: MapTile, map: MatchMap) => void
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
