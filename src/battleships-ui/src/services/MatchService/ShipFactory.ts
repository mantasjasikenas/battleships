import Ship from "@/models/Ships/Ship";
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
import { GameMode } from "@/models/MatchSettings";

// DESIGN PATTERN: 3. Abstract Factory
export abstract class ShipFactoryCreator {
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
}

export interface IShipFactory {
  createCarrier(): Ship;
  createBattleship(): Ship;
  createCruiser(): Ship;
  createSubmarine(): Ship;
  createSpeedboat(): Ship;
  createShips(): Ship[];
}

export class ClassicShipFactory implements IShipFactory {
  createCarrier(): IClassicShip {
    return new ClassicCarrier();
  }
  createBattleship(): IClassicShip {
    return new ClassicBattleship();
  }
  createCruiser(): IClassicShip {
    return new ClassicCruiser();
  }
  createSubmarine(): IClassicShip {
    return new ClassicSubmarine();
  }
  createSpeedboat(): IClassicShip {
    return new ClassicSpeedboat();
  }
  createShips(): Ship[] {
    return [
      this.createCarrier(),
      this.createBattleship(),
      this.createCruiser(),
      this.createSubmarine(),
      this.createSpeedboat(),
    ];
  }
}

export class ModularShipFactory implements IShipFactory {
  createCarrier(): IModularShip {
    return new ModularCarrier();
  }
  createBattleship(): IModularShip {
    return new ModularBattleship();
  }
  createCruiser(): IModularShip {
    return new ModularCruiser();
  }
  createSubmarine(): IModularShip {
    return new ModularSubmarine();
  }
  createSpeedboat(): IModularShip {
    return new ModularSpeedboat();
  }
  createShips(): Ship[] {
    return [
      this.createCarrier(),
      this.createBattleship(),
      this.createCruiser(),
      this.createSubmarine(),
      this.createSpeedboat(),
    ];
  }
}

export class ObservingShipFactory implements IShipFactory {
  createCarrier(): IObservingShip {
    return new ObservingCarrier();
  }
  createBattleship(): IObservingShip {
    return new ObservingBattleship();
  }
  createCruiser(): IObservingShip {
    return new ObservingCruiser();
  }
  createSubmarine(): IObservingShip {
    return new ObservingSubmarine();
  }
  createSpeedboat(): IObservingShip {
    return new ObservingSpeedboat();
  }
  createShips(): Ship[] {
    return [
      this.createCarrier(),
      this.createBattleship(),
      this.createCruiser(),
      this.createSubmarine(),
      this.createSpeedboat(),
    ];
  }
}
