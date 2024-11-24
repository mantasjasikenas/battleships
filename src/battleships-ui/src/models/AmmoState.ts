import GameFacade from "@/services/GameFacade";
import { Ammo } from "./Ammo";
import { Player } from "./Player";
import { MapTile } from "./MatchMap";
import { AttackTurn } from "./Turns/AttackTurn";

export interface AmmoState {

    onAttack(ammo: Ammo, gameFacade: GameFacade, currentPlayer: Player, turn: AttackTurn, selectedTile: MapTile | null): void;
}