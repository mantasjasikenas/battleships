import { AmmoState } from './AmmoState';
import { Ammo } from './Ammo';
import GameFacade from "@/services/GameFacade";
import { Player } from './Player';
import { AttackTurn } from "./Turns/AttackTurn";
import { MapTile } from "./MatchMap";
import { MatchEventNames } from "../services/HubConnectionService/HubConnectionService";
import { AmmoCooldownState } from './AmmoCooldownState';
import { AmmoOutOfAmmoState } from './AmmoOutOfAmmoState';
import { AmmoBuffedState } from './AmmoBuffedState';
import { toast } from 'sonner';

export class AmmoReadyToFireState implements AmmoState {
    onAttack(ammo: Ammo, gameFacade: GameFacade, currentPlayer: Player, turn: AttackTurn, selectedTile: MapTile | null): void {
      
      if(!currentPlayer.ammoCountsInitialized(ammo.type)) {  
        currentPlayer.setAmmoCount(ammo.type, ammo.count);
      }

      if(currentPlayer.getAmmoCount(ammo.type) <= 0) {
        ammo.state = new AmmoOutOfAmmoState();
        turn.ammo.onAttack(gameFacade, currentPlayer, turn, turn.tile);
        return;
      }
  
      gameFacade.sendEvent(MatchEventNames.AttackPerformed, {
        attackerId: currentPlayer.id,
        attackerTeam: currentPlayer.team,
        tile: selectedTile,
        ammoType: ammo.type,
      });
  
      console.log(`Player ${currentPlayer.id} attacked with ammo ${ammo.name} and with ammo cooldown ${ammo.cooldown} and with ammo count ${ammo.count}`);  

      currentPlayer.reduceAmmoCount(ammo.type);
      currentPlayer.setCooldown(ammo.type, ammo.cooldown);
      ammo.state = new AmmoCooldownState();

      // Randomly apply an ammo buff
      if (Math.random() < 0.1) { // 20% chance to apply buff for the same player same ammo who jusat fired
        toast.success("Ammo buffed! Enjoy enhanced effects for the next attack with same ammo type.", { id: "attack-toast", duration: 3000 });
        ammo.state = new AmmoBuffedState();
      }
    }
  }
  