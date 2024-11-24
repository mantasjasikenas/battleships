import { AmmoState } from './AmmoState';
import { Ammo } from './Ammo';
import GameFacade from "@/services/GameFacade";
import { Player } from './Player';
import { MapTile } from "./MatchMap";
import { toast } from "sonner";
import { AttackTurn } from "./Turns/AttackTurn";

export class AmmoOutOfAmmoState implements AmmoState {
    onAttack(ammo: Ammo, gameFacade: GameFacade, currentPlayer: Player, turn: AttackTurn, selectedTile: MapTile | null): void {

      toast.error("Out of ammo!", { 
        id: "attack-toast", 
        duration: 5000
      });
      
      // could be implemented some kind of logic to reload ammo
    }
  }
  