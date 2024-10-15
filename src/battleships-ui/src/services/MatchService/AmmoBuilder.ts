import { Ammo, AmmoType } from "@/models/Ammo";

class AmmoDirector {
  construct(builder: AmmoBuilder) {
    return builder.addDamage().addImpactRadius().addCooldown().addType();
  }
}

// DESIGN PATTERN: Builder
abstract class AmmoBuilder {
  protected ammoItem: Partial<Ammo> = {};

  abstract addDamage(): this;
  abstract addImpactRadius(): this;
  abstract addCooldown(): this;
  abstract addType(): this;

  getResult(): Ammo {
    return Ammo.map(this.ammoItem);
  }
}

class ClassicAmmoBuilder extends AmmoBuilder {
  addDamage(): this {
    this.ammoItem.damage = 1;
    return this;
  }

  addImpactRadius(): this {
    this.ammoItem.impactRadius = 1;
    return this;
  }

  addCooldown(): this {
    this.ammoItem.cooldown = 0;
    return this;
  }

  addType(): this {
    this.ammoItem.type = AmmoType.Classic;
    this.ammoItem.name = "Classic";
    return this;
  }
}

class StandardAmmoBuilder extends AmmoBuilder {
  addDamage(): this {
    this.ammoItem.damage = 3;
    return this;
  }
  addImpactRadius(): this {
    this.ammoItem.impactRadius = 1;
    return this;
  }
  addCooldown(): this {
    this.ammoItem.cooldown = 0;
    return this;
  }
  addType(): this {
    this.ammoItem.type = AmmoType.Standard;
    this.ammoItem.name = "Standard";
    return this;
  }
}

class ArmorPiercingAmmoBuilder extends AmmoBuilder {
  addDamage(): this {
    this.ammoItem.damage = 10;
    return this;
  }
  addImpactRadius(): this {
    this.ammoItem.impactRadius = 1;
    return this;
  }
  addCooldown(): this {
    this.ammoItem.cooldown = 1;
    return this;
  }
  addType(): this {
    this.ammoItem.type = AmmoType.ArmorPiercing;
    this.ammoItem.name = "Armor Piercing";
    return this;
  }
}

class HighExplosiveAmmoBuilder extends AmmoBuilder {
  addDamage(): this {
    this.ammoItem.damage = 2;
    return this;
  }
  addImpactRadius(): this {
    this.ammoItem.impactRadius = 2;
    return this;
  }
  addCooldown(): this {
    this.ammoItem.cooldown = 0;
    return this;
  }
  addType(): this {
    this.ammoItem.type = AmmoType.HighExplosive;
    this.ammoItem.name = "High Explosive";
    return this;
  }
}

class DepthChargeAmmoBuilder extends AmmoBuilder {
  addDamage(): this {
    this.ammoItem.damage = 4;
    return this;
  }
  addImpactRadius(): this {
    this.ammoItem.impactRadius = 2;
    return this;
  }
  addCooldown(): this {
    this.ammoItem.cooldown = 0;
    return this;
  }
  addType(): this {
    this.ammoItem.type = AmmoType.DepthCharge;
    this.ammoItem.name = "Depth Charge";
    return this;
  }
}

export {
  AmmoDirector,
  AmmoBuilder,
  ClassicAmmoBuilder,
  StandardAmmoBuilder,
  ArmorPiercingAmmoBuilder,
  HighExplosiveAmmoBuilder,
  DepthChargeAmmoBuilder,
};
