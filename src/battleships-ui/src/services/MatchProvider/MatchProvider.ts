import { PlayerTeam } from "@/models/Player";
import { Match } from "../../models/Match";
import { ShipPart } from "@/models/Ships/ShipPart";
import { useNavigate } from "react-router-dom";
import { MapTile } from "@/models/MatchMap";

// DESIGN PATTERN: Singleton
export default class MatchProvider {
  
  match: Match;

  private static _instance: MatchProvider;

  private constructor() {
    this.match = new Match();
  }

  public static getPlayer(id: number) {
    return this.Instance.match.players.find((player) => player.id === id);
  }

  public static getTeamPlayers(team: PlayerTeam) {
    return this.Instance.match.players.filter((player) => player.team === team);
  }

  public static getTeamMap(team: PlayerTeam) {
    return this.Instance.match.teamsMap.get(team);
  }

  public static get Instance(): MatchProvider {
    MatchProvider._instance ??= new MatchProvider();

    return MatchProvider._instance;
  }

  public static reset() {
    MatchProvider._instance = new MatchProvider();
  }

  public static handlePlaceTurnEvent(placerId: number, placerTeam: PlayerTeam, tile: MapTile, alignment: number, ships: Ship[]): void{

    const placer = this.Instance.match.players.find((player) => player.id === placerId)!;

    const currentMap = this.Instance.match.teamsMap.get(placerTeam)!;

    const otherTeam =
      placerTeam === PlayerTeam.FirstTeam
        ? PlayerTeam.SecondTeam
        : PlayerTeam.FirstTeam;

    const otherMap = this.Instance.match.teamsMap.get(otherTeam);

    if (alignment === 0) {
      ships[placer.placedShips].parts.forEach(
        (part: ShipPart | undefined, partIndex: number) => {
          currentMap.tiles[tile.x][tile.y + partIndex].shipPart = part;
        },
      );
    } else {
      ships[placer.placedShips].parts.forEach(
        (part: ShipPart | undefined, partIndex: number) => {
          currentMap.tiles[tile.x + partIndex][tile.y].shipPart = part;
        },
      );
    }
    placer.placedShips++;
    
    // if (placer.placedShips >= ships.length && otherMap?.shipsPlaced === true) {
    //   navigate("/match/");
    // } else if (placer.placedShips >= ships.length) {
    //   currentMap.shipsPlaced = true;
    // }
    console.log(placer.placedShips, ships.length, currentMap.shipsPlaced, otherMap?.shipsPlaced);
  }
  
}
