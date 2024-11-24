import { AmmoState } from './AmmoState';
import { toast } from "sonner";

export class AmmoOutOfAmmoState implements AmmoState {
    onAttack(): void {

      toast.error("Out of ammo!", { 
        id: "attack-toast", 
        duration: 5000
      });
      
      // could be implemented some kind of logic to reload ammo
    }
  }
  