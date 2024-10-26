import { invertTeam, PlayerTeam } from "./Player";
import { NavigateFunction } from "react-router-dom";
import { Match } from "./Match";
import { ShipPart } from "./Ships/ShipPart";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import HubConnectionService, { MatchEventNames } from "@/services/HubConnectionService/HubConnectionService";
import MatchProvider from "@/services/MatchProvider/MatchProvider";
import Ship from "./Ships/Ship";
import MatchMap, { MapTile } from "./MatchMap";
import { AmmoType } from "./Ammo";
import { AttackHandlerService } from "@/services/AttackHandlerService/AttackHandlerService";




export interface Command {
    Execute(): void;
    Undo(): void;
}

export class PlaceShipCommand implements Command{
    placerId: number;
    placerTeam: PlayerTeam;
    tile: MapTile;
    alignment: number;
    ships: Ship[];

    constructor(placerId: number, placerTeam: PlayerTeam, tile: MapTile, alignment: number, ships: Ship[]){
        this.placerId = placerId;
        this.placerTeam =  placerTeam;
        this.tile = tile;
        this.alignment = alignment;
        this.ships = ships;
    }    

    Execute(){
        
        const placer = MatchProvider.Instance.match.players.find((player) => player.id === this.placerId)!;
    
        const currentMap = MatchProvider.Instance.match.teamsMap.get(this.placerTeam)!;
    
        if (this.alignment === 0) {
          this.ships[placer.placedShips].parts.forEach(
            (part: ShipPart | undefined, partIndex: number) => {
              currentMap.tiles[this.tile.x][this.tile.y + partIndex].shipPart = part;
            },
          );
        } else {
          this.ships[placer.placedShips].parts.forEach(
            (part: ShipPart | undefined, partIndex: number) => {
              currentMap.tiles[this.tile.x + partIndex][this.tile.y].shipPart = part;
            },
          );
        }
        placer.placedShips++;
        if (placer.placedShips >= this.ships.length) {
            currentMap.shipsPlaced = true;
          }
    }
    Undo(){
        const placer = MatchProvider.Instance.match.players.find((player) => player.id === this.placerId)!;
    
        const currentMap = MatchProvider.Instance.match.teamsMap.get(this.placerTeam)!;
        placer.placedShips--;

        for(let i = 0; i < this.ships[placer.placedShips].parts.length; i++){
            if(this.alignment === 0){
                currentMap.tiles[this.tile.x][this.tile.y + i].shipPart = undefined;
            }
            else{
                currentMap.tiles[this.tile.x + i][this.tile.y].shipPart = undefined;
            }
        }
        currentMap.shipsPlaced = false;
    }
} 

export class AttackCommand implements Command{
    attackerTeam: PlayerTeam;
    tile: MapTile;
    ammoType: AmmoType;
    backUpMap: MatchMap | undefined;

    constructor(attackerTeam: PlayerTeam, tile: MapTile, ammoType: AmmoType){
        this.attackerTeam =  attackerTeam;
        this.tile = tile;
        this.ammoType = ammoType;
    }    

    Execute(){
        const attackedTeam = invertTeam(this.attackerTeam);
    
        const attackedTeamMap = MatchProvider.Instance.match.teamsMap.get(attackedTeam)!;

        this.backUpMap = attackedTeamMap.copy();
        console.log(attackedTeamMap.tiles[0][0], this.backUpMap.tiles[0][0])

        const mapTile = attackedTeamMap.tiles[this.tile.x][this.tile.y];
    
        const attackFunc = AttackHandlerService.getAttackByAmmo(
          this.ammoType,
          MatchProvider.Instance.match.availableAmmoTypes,
        );
        attackFunc(mapTile, attackedTeamMap);
        console.log(attackedTeamMap.tiles[0][0], this.backUpMap.tiles[0][0])
    }
    Undo(){
        if(this.backUpMap){
            const attackedTeam = invertTeam(this.attackerTeam);
            console.log(this.backUpMap.tiles[0][0], MatchProvider.Instance.match.teamsMap.get(attackedTeam)?.tiles[0][0]);
            MatchProvider.Instance.match.teamsMap.set(attackedTeam, this.backUpMap);
            console.log(this.backUpMap.tiles[0][0], MatchProvider.Instance.match.teamsMap.get(attackedTeam)?.tiles[0][0]);
        }
    }
} 

export class Invoker {
    commands: Command[];
    constructor(){
        this.commands = [];
    }
    execute(command: Command){
        command.Execute();
        this.commands.push(command);
        console.log(this.commands.length);
    }

    undo(){
        this.commands.pop()?.Undo();
        console.log(this.commands.length);
    }
}

// export class edditor {
//     public static handlePlaceTurnEvent(placerId: number, placerTeam: PlayerTeam, tile: MapTile, alignment: number, ships: Ship[]): void{

//         const placer = MatchProvider.Instance.match.players.find((player) => player.id === placerId)!;
    
//         const currentMap = MatchProvider.Instance.match.teamsMap.get(placerTeam)!;
    
//         const otherTeam =
//           placerTeam === PlayerTeam.FirstTeam
//             ? PlayerTeam.SecondTeam
//             : PlayerTeam.FirstTeam;
    
//         const otherMap = MatchProvider.Instance.match.teamsMap.get(otherTeam);
    
//         if (alignment === 0) {
//           ships[placer.placedShips].parts.forEach(
//             (part: ShipPart | undefined, partIndex: number) => {
//               currentMap.tiles[tile.x][tile.y + partIndex].shipPart = part;
//             },
//           );
//         } else {
//           ships[placer.placedShips].parts.forEach(
//             (part: ShipPart | undefined, partIndex: number) => {
//               currentMap.tiles[tile.x + partIndex][tile.y].shipPart = part;
//             },
//           );
//         }
//         placer.placedShips++;
        
//         // if (placer.placedShips >= ships.length && otherMap?.shipsPlaced === true) {
//         //   navigate("/match/");
//         // } else if (placer.placedShips >= ships.length) {
//         //   currentMap.shipsPlaced = true;
//         // }
//         console.log(placer.placedShips, ships.length, currentMap.shipsPlaced, otherMap?.shipsPlaced);
//       }
    
//       public static handleAttack(attackerTeam: PlayerTeam, tile: MapTile, ammoType: AmmoType){
//         // const attackedTeam = invertTeam(attackerTeam);
    
//         // const attackedTeamMap = MatchProvider.Instance.match.teamsMap.get(attackedTeam)!;
//         // const mapTile = attackedTeamMap.tiles[tile.x][tile.y];
    
//         // const attackFunc = AttackHandlerService.getAttackByAmmo(
//         //   ammoType,
//         //   MatchProvider.Instance.match.availableAmmoTypes,
//         // );
    
//         // attackFunc(mapTile, attackedTeamMap);
//       }
// }

