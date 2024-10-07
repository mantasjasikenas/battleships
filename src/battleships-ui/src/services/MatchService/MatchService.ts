import MatchMap from "../../models/MatchMap";
import { GameMode } from "../../models/MatchSettings";
import { PlayerTeam } from "../../models/Player";
import Ship from "../../models/Ships/Ship";
import MatchProvider from "../MatchProvider/MatchProvider";
import {
  AmmoFactory,
  AmmoGameModeFactory,
  ClassicGameModeFactory,
  FogOfWarGameModeFactory,
} from "./AmmoFactory";
import { ShipFactoryCreator } from "./ShipFactory";

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
    const shipFactory = ShipFactoryCreator.getShipFactory(
      match.settings.gameMode,
    );

    match.teamsMap.forEach((map) => {
      const ships = shipFactory.createShips();
      this.initPlayerShipsPlacement(map, ships);
    });
  }

  static initMatchAvailableAmmo(): void {
    const match = MatchProvider.Instance.match;
    let ammoFactory: AmmoFactory;

    switch (match.settings.gameMode) {
      case GameMode.Ammo:
        ammoFactory = new AmmoGameModeFactory();
        break;
      case GameMode.Classic:
        ammoFactory = new ClassicGameModeFactory();
        break;
      case GameMode.FogOfWar:
        ammoFactory = new FogOfWarGameModeFactory();
        break;
    }

    match.availableAmmoTypes = ammoFactory.createAmmo();
  }

  static removePlayerFromMatch(playerId: number): void {
    const match = MatchProvider.Instance.match;

    match.players = match.players.filter((player) => player.id !== playerId);
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
