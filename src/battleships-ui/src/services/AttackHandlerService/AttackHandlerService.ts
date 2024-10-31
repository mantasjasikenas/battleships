import { toast } from "sonner";
import { Ammo, AmmoType } from "../../models/Ammo";
import MatchMap, { MapTile } from "../../models/MatchMap";
import { PlayerTeam } from "../../models/Player";
import {
  armorPiercingAttackStrategy,
  classicAttackStrategy,
  Context,
  AreaAttackAdapter,
  standardAttackStrategy,
  AreaStrategy,
} from "../../models/strategy";
export interface AttackTurnEventProps {
  attackerId: number;
  attackerTeam: PlayerTeam;
  tile: MapTile;
  ammoType: AmmoType;
}
export class AttackHandlerService {
  public static getAttackByAmmo(
    ammoType: AmmoType,
    availableAmmoTypes: Ammo[],
  ): (tile: MapTile, map: MatchMap) => void {
    const ammo = availableAmmoTypes.find((ammo) => ammo.type === ammoType);

    if (!ammo) {
      toast.error(
        `Unable to resolve attack by type ${ammoType}. Available types are: ${JSON.stringify(
          availableAmmoTypes,
        )}`,
      );

      return () => {};
    }

    switch (ammoType) {
      case AmmoType.Classic:
        Context.setStrategy(new classicAttackStrategy());
        break;
      case AmmoType.Standard:
        Context.setStrategy(new standardAttackStrategy());
        break;
      case AmmoType.ArmorPiercing:
        Context.setStrategy(new armorPiercingAttackStrategy());
        break;
      case AmmoType.HighExplosive || AmmoType.DepthCharge: {
        const adapter = new AreaAttackAdapter(new AreaStrategy());
        Context.setStrategy(adapter);
        break;
      }
    }

    return (tile: MapTile, map: MatchMap) =>
      Context.executeStrategy(ammo!, tile, map);
  }
}
