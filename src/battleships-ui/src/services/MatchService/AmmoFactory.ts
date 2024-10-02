import { Ammo, AmmoType } from "@/models/Ammo";

// DESIGN PATTERN: Factory Method
export interface AmmoFactory {
  createAmmo(): Ammo[];
}

export class ClassicGameModeFactory implements AmmoFactory {
  createAmmo(): Ammo[] {
    return [
      Ammo.map({
        name: "Classic",
        damage: 1,
        impactRadius: 1,
        cooldown: 0,
        type: AmmoType.Classic,
      }),
    ];
  }
}

export class AmmoGameModeFactory implements AmmoFactory {
  createAmmo(): Ammo[] {
    return [
      Ammo.map({
        name: "Standard",
        damage: 3,
        impactRadius: 1,
        cooldown: 0,
        type: AmmoType.Standard,
      }),
      Ammo.map({
        name: "Armor Piercing",
        damage: 10,
        impactRadius: 1,
        cooldown: 1,
        type: AmmoType.ArmorPiercing,
      }),
      Ammo.map({
        name: "High Explosive",
        damage: 2,
        impactRadius: 2,
        cooldown: 0,
        type: AmmoType.HighExplosive,
      }),
      Ammo.map({
        name: "Depth Charge",
        damage: 4,
        impactRadius: 2,
        cooldown: 0,
        type: AmmoType.DepthCharge,
      }),
    ];
  }
}
