import { Ammo, AmmoType } from "../../models/Ammo";
import MatchMap from "../../models/MatchMap";
import { GameMode } from "../../models/MatchSettings";
import { PlayerTeam } from "../../models/Player";
import {
  ClassicBattleship,
  ClassicCarrier,
  ClassicCruiser,
  ClassicSpeedboat,
  ClassicSubmarine,
  IClassicShip,
} from "../../models/Ships/ClassicShips";
import {
  ModularCarrier,
  ModularBattleship,
  ModularCruiser,
  ModularSubmarine,
  ModularSpeedboat,
  IModularShip,
} from "../../models/Ships/ModularShips";
import {
  ObservingCarrier,
  ObservingBattleship,
  ObservingCruiser,
  ObservingSubmarine,
  ObservingSpeedboat,
  IObservingShip,
} from "../../models/Ships/ObservingShips";
import Ship from "../../models/Ships/Ship";
import MatchProvider from "../MatchProvider/MatchProvider";

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

    match.teamsMap.forEach((map) => {
      const ships = this.getShipSet(match.settings.gameMode);

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

  private static initPlayerShipsPlacement(map: MatchMap, ships: Ship[]): void {
    ships.forEach((ship, index) => {
      const rowIndex = index * 2;

      ship.parts.forEach((part, partIndex) => {
        map.tiles[rowIndex][partIndex].shipPart = part;
      });
    });
  }

  private static getShipSet(gameMode: GameMode): Ship[] {
    switch (gameMode) {
      case GameMode.Classic:
        return this.getClassicShipSet();
      case GameMode.Ammo:
        return this.getModularShipSet();
      case GameMode.FogOfWar:
        return this.getObservingShipSet();
    }
  }

  private static getClassicShipSet(): IClassicShip[] {
    return [
      new ClassicCarrier(),
      new ClassicBattleship(),
      new ClassicCruiser(),
      new ClassicSubmarine(),
      new ClassicSpeedboat(),
    ];
  }

  private static getModularShipSet(): IModularShip[] {
    return [
      new ModularCarrier(),
      new ModularBattleship(),
      new ModularCruiser(),
      new ModularSubmarine(),
      new ModularSpeedboat(),
    ];
  }

  private static getObservingShipSet(): IObservingShip[] {
    return [
      new ObservingCarrier(),
      new ObservingBattleship(),
      new ObservingCruiser(),
      new ObservingSubmarine(),
      new ObservingSpeedboat(),
    ];
  }
}
