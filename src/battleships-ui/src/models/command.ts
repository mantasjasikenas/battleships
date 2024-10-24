import { PlayerTeam } from "./Player";
import { NavigateFunction } from "react-router-dom";
import { Match } from "./Match";
import { ShipPart } from "./Ships/ShipPart";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import HubConnectionService, { MatchEventNames } from "@/services/HubConnectionService/HubConnectionService";
import MatchProvider from "@/services/MatchProvider/MatchProvider";
import Ship from "./Ships/Ship";
import { MapTile } from "./MatchMap";



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

    Execute(): void {
        MatchProvider.handlePlaceTurnEvent(this.placerId, this.placerTeam, this.tile, this.alignment, this.ships);
    }
    Undo(){}
} 

export class Invoker {
    private command: Command | undefined;

    public setCommand(command: Command) {
        this.command = command;
    }

    public pressButton() {
        if(this.command){
            this.command.Execute();
        }
    }
}

