export enum GameMode {
  Classic = "Classic",
  Ammo = "Ammo",
  FogOfWar = "FogOfWar",
}

export default class MatchSettings {
  gameMode!: GameMode;

  constructor(object?: Partial<MatchSettings>) {
    this.gameMode = object?.gameMode ?? GameMode.Classic;
  }
}
