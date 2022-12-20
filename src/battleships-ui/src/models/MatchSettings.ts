export enum GameMode {
  Classic = 'Classic',
  Ammo = 'Ammo',
  FogOfWar = 'FogOfWar',
}

export default class MatchSettings {
  gameMode!: GameMode;
  useDice!: boolean;

  constructor(object?: Partial<MatchSettings>) {
    this.gameMode = object?.gameMode ?? GameMode.Classic;
    this.useDice = !!object?.useDice;
  }
}
