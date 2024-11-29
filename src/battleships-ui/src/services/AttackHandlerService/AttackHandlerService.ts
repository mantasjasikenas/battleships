import { toast } from "sonner";
import { Ammo, AmmoType } from "../../models/Ammo";
import MatchMap, { MapTile } from "../../models/MatchMap";
import { PlayerTeam } from "../../models/Player";
import {
  AreaAttackAdapter,
  AreaStrategy,
  armorPiercingAttackHandler,
  classicAttackHandler,
  standardAttackHandler,
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

    return (tile: MapTile, map: MatchMap) =>{
      const clasicHandler = new classicAttackHandler(ammo!, tile, map);
      const standardHandler = new standardAttackHandler(ammo!, tile, map);
      const ammorPiercingHandler = new armorPiercingAttackHandler(ammo!, tile, map);
      const adapter = new AreaAttackAdapter(ammo!, tile, map, new AreaStrategy());
      clasicHandler.setNext(standardHandler).setNext(ammorPiercingHandler).setNext(adapter);
      clasicHandler.attack();
    }
  }
}
