import { AmmoState } from './AmmoState';
import { Ammo } from './Ammo';
import GameFacade from "@/services/GameFacade";
import { Player } from './Player';
import { MapTile } from "./MatchMap";
import { AmmoCooldownState } from './AmmoCooldownState';
import { AmmoOutOfAmmoState } from './AmmoOutOfAmmoState';
import { AttackTurn } from "./Turns/AttackTurn";
import { MatchEventNames } from "../services/HubConnectionService/HubConnectionService";

export class AmmoBuffedState implements AmmoState {
  onAttack(ammo: Ammo, gameFacade: GameFacade, currentPlayer: Player, turn: AttackTurn, selectedTile: MapTile | null): void {

    ammo.damage *= 2;
    ammo.impactRadius *= 2;
    ammo.cooldown /= 2;

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

    console.log(`Player ${currentPlayer.id} attacked with BUFFED ammo ${ammo.name} and with ammo cooldown ${ammo.cooldown} and with ammo count ${ammo.count}`);  

    // revert

    ammo.damage /= 2;
    ammo.impactRadius /= 2;
    ammo.cooldown *= 2;

    currentPlayer.reduceAmmoCount(ammo.type);
    currentPlayer.setCooldown(ammo.type, ammo.cooldown);
    ammo.state = new AmmoCooldownState();
  }
}
