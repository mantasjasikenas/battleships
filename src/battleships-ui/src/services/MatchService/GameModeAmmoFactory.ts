import { Ammo } from "@/models/Ammo";
import {
  AmmoBuilder,
  AmmoDirector,
  ArmorPiercingAmmoBuilder,
  ClassicAmmoBuilder,
  DepthChargeAmmoBuilder,
  HighExplosiveAmmoBuilder,
  StandardAmmoBuilder,
} from "./AmmoBuilder";

// DESIGN PATTERN: 2. Factory
export interface GameModeAmmoFactory {
  createAmmo(): Ammo[];
}

export class ClassicGameModeFactory implements GameModeAmmoFactory {
  createAmmo(): Ammo[] {
    const classicAmmoBuilder: AmmoBuilder = new ClassicAmmoBuilder();
    const director = new AmmoDirector();

    director.construct(classicAmmoBuilder);

    return [classicAmmoBuilder.getResult()];
  }
}

export class AmmoGameModeFactory implements GameModeAmmoFactory {
  createAmmo(): Ammo[] {
    const director = new AmmoDirector();

    const standardAmmoBuilder: AmmoBuilder = new StandardAmmoBuilder();
    const armorPiercingAmmoBuilder: AmmoBuilder =
      new ArmorPiercingAmmoBuilder();
    const hightExplosiveAmmoBuilder: AmmoBuilder =
      new HighExplosiveAmmoBuilder();
    const depthChargeAmmoBuilder: AmmoBuilder = new DepthChargeAmmoBuilder();

    director.construct(standardAmmoBuilder);
    director.construct(armorPiercingAmmoBuilder);
    director.construct(hightExplosiveAmmoBuilder);
    director.construct(depthChargeAmmoBuilder);

    return [
      standardAmmoBuilder.getResult(),
      armorPiercingAmmoBuilder.getResult(),
      hightExplosiveAmmoBuilder.getResult(),
      depthChargeAmmoBuilder.getResult(),
    ];
  }
}

export class FogOfWarGameModeFactory implements GameModeAmmoFactory {
  createAmmo(): Ammo[] {
    const classicAmmoBuilder: AmmoBuilder = new ClassicAmmoBuilder();
    const director = new AmmoDirector();

    director.construct(classicAmmoBuilder);

    return [classicAmmoBuilder.getResult()];
  }
}
