import MatchMap from "../../models/MatchMap";
import { GameMode } from "../../models/MatchSettings";
import { PlayerTeam } from "../../models/Player";
import Ship from "../../models/Ships/Ship";
import MatchProvider from "../MatchProvider/MatchProvider";
import {
  AmmoFactory,
  AmmoGameModeFactory,
  ClassicGameModeFactory,
} from "./AmmoFactory";
import {
  IShipFactory,
  ClassicShipFactory,
  ModularShipFactory,
  ObservingShipFactory,
} from "./ShipFactory";

export class MatchService {
  static initMatchTeams(): void {
    const match = MatchProvider.Instance.match;

    match.players.sort((a, b) => a.id - b.id);

    match.players.forEach((player, index) => {
      player.team =
        index % 2 === 0 ? PlayerTeam.FirstTeam : PlayerTeam.SecondTeam;
    });

    match.teamsMap.set(
      PlayerTeam.FirstTeam,
      new MatchMap(match.mapSize, match.mapSize),
    );
    match.teamsMap.set(
      PlayerTeam.SecondTeam,
      new MatchMap(match.mapSize, match.mapSize),
    );
  }

  static initMatchPlayerVehicles(): void {
    const match = MatchProvider.Instance.match;
    const shipFactory = this.getShipFactory(match.settings.gameMode);

    match.teamsMap.forEach((map) => {
      const ships = shipFactory.createShips();
      this.initPlayerShipsPlacement(map, ships);
    });
  }

  static initMatchAvailableAmmo(): void {
    const match = MatchProvider.Instance.match;
    let ammoFactory: AmmoFactory;

    if (match.settings.gameMode === GameMode.Ammo) {
      ammoFactory = new AmmoGameModeFactory();
    } else {
      ammoFactory = new ClassicGameModeFactory();
    }

    match.availableAmmoTypes = ammoFactory.createAmmo();
  }

  static removePlayerFromMatch(playerId: number): void {
    const match = MatchProvider.Instance.match;

    match.players = match.players.filter((player) => player.id !== playerId);
  }

  static getShipFactory(gameMode: GameMode): IShipFactory {
    switch (gameMode) {
      case GameMode.Classic:
        return new ClassicShipFactory();
      case GameMode.Ammo:
        return new ModularShipFactory();
      case GameMode.FogOfWar:
        return new ObservingShipFactory();
      default:
        throw new Error("Unsupported game mode");
    }
  }

  private static initPlayerShipsPlacement(map: MatchMap, ships: Ship[]): void {
    ships.forEach((ship, index) => {
      const rowIndex = index * 2;

      ship.parts.forEach((part, partIndex) => {
        map.tiles[rowIndex][partIndex].shipPart = part;
      });
    });
  }
}
