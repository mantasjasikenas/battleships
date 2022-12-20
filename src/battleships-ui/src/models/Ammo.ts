// non-Classic ammo types used only in "Ammo" gamemode
export enum AmmoType {
  Classic,
  Standard,
  ArmorPiercing,
  HighExplosive,
  DepthCharge,
}

export class Ammo {
  name!: string;
  type!: AmmoType;
  damage!: number;
  impactRadius!: number;
  cooldown!: number;

  static map(object: Partial<Ammo>, model = new Ammo()): Ammo {
    if (object == null) {
      return model;
    }

    model.name = object.name ?? 'Standard';
    model.type = object.type ?? AmmoType.Standard;
    model.damage = object.damage ?? 1;
    model.impactRadius = object.impactRadius ?? 1;
    model.cooldown = object.cooldown ?? 0;

    return model;
  }

  static mapList(list: Ammo[] = []): Ammo[] {
    const result = list.map((item) => this.map(item));

    return result;
  }
}
