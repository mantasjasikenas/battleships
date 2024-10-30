import { Player } from '../../models/Player';

export class PlayerService {
  private static LOCAL_STORAGE_PLAYER_KEY = 'PLAYER';

  static createNew(name: string): Player {
    const player = new Player({ name: name });

    this.saveToSessionStorage(player);

    return player;
  }

  static saveToSessionStorage(player: Player) {
    sessionStorage.setItem(
      this.LOCAL_STORAGE_PLAYER_KEY,
      JSON.stringify(player)
    );
  }

  static removeFromSessionStorage() {
    sessionStorage.removeItem(this.LOCAL_STORAGE_PLAYER_KEY);
  }

  static getFromSessionStorage(): Player | undefined {
    const value = sessionStorage.getItem(this.LOCAL_STORAGE_PLAYER_KEY);

    if (value == null) {
      return undefined;
    }

    return JSON.parse(value);
  }
}
