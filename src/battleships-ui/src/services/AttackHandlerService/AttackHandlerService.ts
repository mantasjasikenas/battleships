import { Ammo, AmmoType } from '../../models/Ammo';
import MatchMap, { MapTile } from '../../models/MatchMap';
import { PlayerTeam } from '../../models/Player';
import { ShipClass } from '../../models/Ships/ShipClass';
import { ModularShipPart } from '../../models/Ships/ShipPart';
import MatchProvider from '../MatchProvider/MatchProvider';
import { armorPiercingAttackStrategy, classicAttackStrategy, Context, depthChargeAttackStrategy, highExplosiveAttackStrategy, standardAttackStrategy } from '../../models/strategy';
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
        Context.setStrategy(new classicAttackStrategy);
        break;
      case AmmoType.Standard:
        Context.setStrategy(new standardAttackStrategy);
        break;
      case AmmoType.ArmorPiercing:
        Context.setStrategy(new armorPiercingAttackStrategy);
        break;
      case AmmoType.HighExplosive:
        Context.setStrategy(new highExplosiveAttackStrategy);
        break;
      case AmmoType.DepthCharge:
        Context.setStrategy(new depthChargeAttackStrategy);
    }

    return (tile: MapTile, map: MatchMap) => Context.executeStrategy(ammo!, tile, map);
  }

  //   switch (ammoType) {
  //     case AmmoType.Classic:
        
  //       return (tile: MapTile, map: MatchMap) =>
  //         this.classicAttack(ammo!, tile, map);
  //     case AmmoType.Standard:
  //       return (tile: MapTile, map: MatchMap) =>
  //         this.standardAttack(ammo!, tile, map);
  //     case AmmoType.ArmorPiercing:
  //       return (tile: MapTile, map: MatchMap) =>
  //         this.armorPiercingAttack(ammo!, tile, map);
  //     case AmmoType.HighExplosive:
  //       return (tile: MapTile, map: MatchMap) =>
  //         this.highExplosiveAttack(ammo!, tile, map);
  //     case AmmoType.DepthCharge:
  //       return (tile: MapTile, map: MatchMap) =>
  //         this.depthChargeAttack(ammo!, tile, map);
  //   }
  // }
}
