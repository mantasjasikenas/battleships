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

export interface IShipFactory {
  createShips(): Ship[];
}

export class ClassicShipFactory implements IShipFactory {
  createShips(): IClassicShip[] {
    return [
      new ClassicCarrier(),
      new ClassicBattleship(),
      new ClassicCruiser(),
      new ClassicSubmarine(),
      new ClassicSpeedboat(),
    ];
  }
}

export class ModularShipFactory implements IShipFactory {
  createShips(): IModularShip[] {
    return [
      new ModularCarrier(),
      new ModularBattleship(),
      new ModularCruiser(),
      new ModularSubmarine(),
      new ModularSpeedboat(),
    ];
  }
}

export class ObservingShipFactory implements IShipFactory {
  createShips(): IObservingShip[] {
    return [
      new ObservingCarrier(),
      new ObservingBattleship(),
      new ObservingCruiser(),
      new ObservingSubmarine(),
      new ObservingSpeedboat(),
    ];
  }
}
