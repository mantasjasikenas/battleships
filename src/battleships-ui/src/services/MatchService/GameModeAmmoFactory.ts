import {
  AmmoBuilder,
  AmmoDirector,
  ArmorPiercingAmmoBuilder,
  ClassicAmmoBuilder,
  DepthChargeAmmoBuilder,
  HighExplosiveAmmoBuilder,
  StandardAmmoBuilder,
} from "./AmmoBuilder";
import { AmmoCollection } from "@/models/Ships/iterators/AmmoCollection";

// DESIGN PATTERN: 2. Factory
export interface GameModeAmmoFactory {
  createAmmo(): AmmoCollection;
}

export class ClassicGameModeFactory implements GameModeAmmoFactory {
  createAmmo(): AmmoCollection {
    const classicAmmoBuilder: AmmoBuilder = new ClassicAmmoBuilder();
    const director = new AmmoDirector();

    director.construct(classicAmmoBuilder);

    const ammoCollection = new AmmoCollection();
    ammoCollection.addAmmo(classicAmmoBuilder.getResult());

    return ammoCollection;
  }
}

export class AmmoGameModeFactory implements GameModeAmmoFactory {
  createAmmo(): AmmoCollection {
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

    const ammoCollection = new AmmoCollection();

    ammoCollection.addAmmo(standardAmmoBuilder.getResult());
    ammoCollection.addAmmo(armorPiercingAmmoBuilder.getResult());
    ammoCollection.addAmmo(hightExplosiveAmmoBuilder.getResult());
    ammoCollection.addAmmo(depthChargeAmmoBuilder.getResult());

    return ammoCollection;
  }
}

export class FogOfWarGameModeFactory implements GameModeAmmoFactory {
  createAmmo(): AmmoCollection {
    const classicAmmoBuilder: AmmoBuilder = new ClassicAmmoBuilder();
    const director = new AmmoDirector();

    director.construct(classicAmmoBuilder);

    const ammoCollection = new AmmoCollection();

    ammoCollection.addAmmo(classicAmmoBuilder.getResult());

    return ammoCollection;
  }
}
