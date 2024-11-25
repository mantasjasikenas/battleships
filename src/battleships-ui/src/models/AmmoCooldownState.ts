import { AmmoState } from './AmmoState';
import { Ammo } from './Ammo';
import GameFacade from "@/services/GameFacade";
import { Player } from './Player';
import { toast } from "sonner";
import { AttackTurn } from "./Turns/AttackTurn";
import { AmmoReadyToFireState } from './AmmoReadyToFireState';

export class AmmoCooldownState implements AmmoState {
    onAttack(ammo: Ammo, gameFacade: GameFacade, currentPlayer: Player, turn: AttackTurn): void {

        if (currentPlayer.isCooldownDone(ammo.type)) {    
          ammo.state = new AmmoReadyToFireState();
          turn.ammo.onAttack(gameFacade, currentPlayer, turn, turn.tile);
          return;
        }
        else {
            toast.error(`Ammo is cooling down for ${currentPlayer.ammoCooldowns.get(ammo.type)} more seconds.`, { id: "attack-toast", duration: 3000 });
        }
      }
  }
