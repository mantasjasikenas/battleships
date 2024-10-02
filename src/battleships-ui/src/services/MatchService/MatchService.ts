import { Ammo, AmmoType } from "../../models/Ammo";
import MatchMap from "../../models/MatchMap";
import { GameMode } from "../../models/MatchSettings";
import { PlayerTeam } from "../../models/Player";
import Ship from "../../models/Ships/Ship";
import MatchProvider from "../MatchProvider/MatchProvider";
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

    if (match.settings.gameMode === GameMode.Ammo) {
      const standardAmmo = Ammo.map({
        name: "Standard",
        damage: 3,
        impactRadius: 1,
        cooldown: 0,
        type: AmmoType.Standard,
      });
      const armorPiercingAmmo = Ammo.map({
        name: "Armor Piercing",
        damage: 10,
        impactRadius: 1,
        cooldown: 1,
        type: AmmoType.ArmorPiercing,
      });
      const highExplosiveAmmo = Ammo.map({
        name: "High Explosive",
        damage: 2,
        impactRadius: 2,
        cooldown: 0,
        type: AmmoType.HighExplosive,
      });
      const depthChargeAmmo = Ammo.map({
        name: "Depth Charge",
        damage: 4,
        impactRadius: 2,
        cooldown: 0,
        type: AmmoType.DepthCharge,
      });
      match.availableAmmoTypes.push(standardAmmo);
      match.availableAmmoTypes.push(armorPiercingAmmo);
      match.availableAmmoTypes.push(highExplosiveAmmo);
      match.availableAmmoTypes.push(depthChargeAmmo);
    } else {
      const classicAmmo = Ammo.map({
        name: "Classic",
        damage: 1,
        impactRadius: 1,
        cooldown: 0,
        type: AmmoType.Classic,
      });
      match.availableAmmoTypes.push(classicAmmo);
    }
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
