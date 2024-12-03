import { Ammo } from "./Ammo";
import { Player } from "./Player";
import { MapTile } from "./MatchMap";
import { AttackTurn } from "./Turns/AttackTurn";
import { IGameFacade } from "@/services/IGameFacade";

export interface AmmoState {

    onAttack(ammo: Ammo, gameFacade: IGameFacade, currentPlayer: Player, turn: AttackTurn, selectedTile: MapTile | null): void;
}