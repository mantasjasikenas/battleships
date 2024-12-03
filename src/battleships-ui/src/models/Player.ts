import { AmmoType } from "./Ammo";
import { Invoker } from "./command";
import Ship from "./Ships/Ship";
import { AttackTurn } from "./Turns/AttackTurn";

export enum PlayerTeam {
  FirstTeam = "FirstTeam",
  SecondTeam = "SecondTeam",
}

export function invertTeam(team: PlayerTeam): PlayerTeam {
  return team === PlayerTeam.FirstTeam
    ? PlayerTeam.SecondTeam
    : PlayerTeam.FirstTeam;
}

export class Player {
  id: number;
  name: string;
  team: PlayerTeam;
  attackTurns: AttackTurn[] = [];
  placedShips = 0;
  ships: Ship[];
  invoker: Invoker;
  ammoCooldowns: Map<AmmoType, number>;
  ammoCounts: Map<AmmoType, number>;
  ammoInitialized: Map<AmmoType, boolean> = new Map();

  constructor(object: Partial<Player>) {
    this.id = object.id ?? Math.round(Math.random() * 1000);
    this.name = object.name ?? "New player";
    this.team = object.team ? PlayerTeam[object.team] : PlayerTeam.FirstTeam;
    this.attackTurns = object.attackTurns ?? [];
    this.placedShips = object.placedShips ?? 0;
    this.ships = object.ships ?? [];
    this.invoker =
      object.invoker instanceof Invoker ? object.invoker : new Invoker();
    this.ammoCooldowns =
      object.ammoCooldowns instanceof Map ? object.ammoCooldowns : new Map();
    this.ammoCounts =
      object.ammoCounts instanceof Map ? object.ammoCounts : new Map();
    this.ammoInitialized =
      object.ammoInitialized instanceof Map
        ? object.ammoInitialized
        : new Map();
  }

  public invertTeam() {
    this.team =
      this.team === PlayerTeam.FirstTeam
        ? PlayerTeam.SecondTeam
        : PlayerTeam.FirstTeam;
  }

  ammoCountsInitialized(ammoType: AmmoType): boolean {
    return this.ammoInitialized.get(ammoType) === true;
  }

  setAmmoCount(ammoType: AmmoType, count: number) {
    this.ammoCounts.set(ammoType, count);
    this.ammoInitialized.set(ammoType, true);
  }

  getAmmoCount(ammoType: AmmoType): number {
    const ammoCount = this.ammoCounts.get(ammoType);

    return ammoCount !== undefined ? ammoCount : 0;
  }

  reduceAmmoCount(ammoType: AmmoType): void {
    const currentAmmoCount = this.ammoCounts.get(ammoType);

    if (currentAmmoCount !== undefined && currentAmmoCount > 0) {
      this.ammoCounts.set(ammoType, currentAmmoCount - 1);
    }
  }

  setCooldown(ammoType: AmmoType, cooldownTime: number): void {
    this.ammoCooldowns.set(ammoType, cooldownTime);
  }

  reduceCooldown(): void {
    for (const [ammoType, cooldownTime] of this.ammoCooldowns) {
      if (cooldownTime > 0) {
        this.ammoCooldowns.set(ammoType, cooldownTime - 1);
      }
    }
  }

  isCooldownDone(ammoType: AmmoType): boolean {
    return this.ammoCooldowns.get(ammoType) === 0;
  }

  clone(): Player {
    return new Player({
      id: this.id,
      name: this.name,
      team: this.team,
      attackTurns: this.attackTurns.map(() => new AttackTurn()),
      placedShips: this.placedShips,
      ships: JSON.parse(JSON.stringify(this.ships)),
      invoker: this.invoker.clone(),
      ammoCooldowns: new Map(),
      ammoCounts: new Map(),
      ammoInitialized: new Map(),
    });
  }
}
