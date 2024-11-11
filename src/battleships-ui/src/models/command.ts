import { invertTeam, PlayerTeam } from "./Player";
import { ShipPart } from "./Ships/ShipPart";
import MatchProvider from "@/services/MatchProvider/MatchProvider";
import Ship from "./Ships/Ship";
import MatchMap, { MapTile } from "./MatchMap";
import { AmmoType } from "./Ammo";
import { AttackHandlerService } from "@/services/AttackHandlerService/AttackHandlerService";

// DESIGN PATTERN: 9. Command
export interface Command {
  execute(): void;
  undo(): void;
}

export class PlaceShipCommand implements Command {
  placerId: number;
  placerTeam: PlayerTeam;
  tile: MapTile;
  alignment: number;
  ships: Ship[];

  constructor(
    placerId: number,
    placerTeam: PlayerTeam,
    tile: MapTile,
    alignment: number,
    ships: Ship[],
  ) {
    this.placerId = placerId;
    this.placerTeam = placerTeam;
    this.tile = tile;
    this.alignment = alignment;
    this.ships = ships;
  }

  execute() {
    const placer = MatchProvider.Instance.match.players.find(
      (player) => player.id === this.placerId,
    )!;

    const currentMap = MatchProvider.Instance.match.teamsMap.get(
      this.placerTeam,
    )!;

    if (this.alignment === 0) {
      this.ships[placer.placedShips].partsImplementation.parts.forEach(
        (part: ShipPart | undefined, partIndex: number) => {
          currentMap.tiles[this.tile.x][this.tile.y + partIndex].shipPart =
            part;
        },
      );
    } else {
      this.ships[placer.placedShips].partsImplementation.parts.forEach(
        (part: ShipPart | undefined, partIndex: number) => {
          currentMap.tiles[this.tile.x + partIndex][this.tile.y].shipPart =
            part;
        },
      );
    }
    placer.placedShips++;
    if (placer.placedShips >= this.ships.length) {
      currentMap.shipsPlaced = true;
    }
  }

  undo() {
    const placer = MatchProvider.Instance.match.players.find(
      (player) => player.id === this.placerId,
    )!;

    const currentMap = MatchProvider.Instance.match.teamsMap.get(
      this.placerTeam,
    )!;
    placer.placedShips--;

    for (let i = 0; i < this.ships[placer.placedShips].partsImplementation.parts.length; i++) {
      if (this.alignment === 0) {
        currentMap.tiles[this.tile.x][this.tile.y + i].shipPart = undefined;
      } else {
        currentMap.tiles[this.tile.x + i][this.tile.y].shipPart = undefined;
      }
    }
    currentMap.shipsPlaced = false;
  }
}

export class AttackCommand implements Command {
  attackerTeam: PlayerTeam;
  tile: MapTile;
  ammoType: AmmoType;
  backUpMap: MatchMap | undefined;

  constructor(attackerTeam: PlayerTeam, tile: MapTile, ammoType: AmmoType) {
    this.attackerTeam = attackerTeam;
    this.tile = tile;
    this.ammoType = ammoType;
  }

  execute() {
    const attackedTeam = invertTeam(this.attackerTeam);

    const attackedTeamMap =
      MatchProvider.Instance.match.teamsMap.get(attackedTeam)!;

    this.backUpMap = attackedTeamMap.copy();

    const mapTile = attackedTeamMap.tiles[this.tile.x][this.tile.y];

    const attackFunc = AttackHandlerService.getAttackByAmmo(
      this.ammoType,
      MatchProvider.Instance.match.availableAmmoTypes.values,
    );
    attackFunc(mapTile, attackedTeamMap);
  }
  undo() {
    if (this.backUpMap) {
      const attackedTeam = invertTeam(this.attackerTeam);
      MatchProvider.Instance.match.teamsMap.set(attackedTeam, this.backUpMap);
    }
  }
}

export class Invoker {
  commands: Command[];

  constructor() {
    this.commands = [];
  }
  execute(command: Command) {
    command.execute();
    this.commands.push(command);
  }

  undo() {
    this.commands.pop()?.undo();
  }
}
