import { MapTile } from "@/models/MatchMap";
import { Player } from "@/models/Player";
import { toast } from "sonner";
import { IGameFacade } from "../IGameFacade";
import { Ammo } from "@/models/Ammo";
import { MatchEventNames } from "../HubConnectionService/HubConnectionService";

// DESIGN PATTERN: 21. Mediator

class Component {
    mediator : Mediator;
    constructor(mediator: Mediator){
        this.mediator = mediator;
    }
}

export class SelectedTile extends Component{
    private tile: MapTile | null;
    constructor(mediator: Mediator){
        super(mediator)
        this.tile = null;
        this.onOwnTileSelect = this.onOwnTileSelect.bind(this);
        this.getile = this.getile.bind(this);
        this.setTile = this.setTile.bind(this);
        this.onAttackTurnTargetTileSelect = this.onAttackTurnTargetTileSelect.bind(this);
    }
    setTile(tile: MapTile | null){
        this.tile = tile;
        this.mediator.notify(this, "Set");  
    }
    getile(){
        return this.tile;
    }
    onAttackTurnTargetTileSelect(tile: MapTile){
        this.tile = tile;
        this.mediator.notify(this, "Enemie");
    }
    onOwnTileSelect(_tile: MapTile): void {
        this.tile = null;
        this.mediator.notify(this, "Own");
    }
}

export class AmmoSelect extends Component{

    private selectedAmmo: Ammo;
    constructor(mediator: Mediator, ammo: Ammo){
        super(mediator)
        this.selectedAmmo = ammo;
        this.getAmmo = this.getAmmo.bind(this);
        this.setAmmo = this.setAmmo.bind(this);
        this.AttackSelect = this.AttackSelect.bind(this);
        this.mediator.notify(this, "Set");
    }
    getAmmo(){
        return this.selectedAmmo;
    }
    setAmmo(ammo: Ammo){
        this.selectedAmmo = ammo;
        this.mediator.notify(this, "Set");
    }
    AttackSelect(ammo: Ammo){
        this.selectedAmmo = ammo;
        this.mediator.notify(this, "Select");
    }
}

export class ButtonClicked  extends Component{
    onAttack(): void {
        this.mediator.notify(this, "Attack");
      }

      onUndo(): void {
        this.mediator.notify(this, "Undo");
      }
}

interface Mediator {
    notify(sender: Component, event: string): void;
}

export class actionMediator implements Mediator{
    currentPlayer: Player;
    gameFacade: IGameFacade;
    selctedTileInfo: SelectedTile | undefined;
    selectedAmmoInfo: AmmoSelect | undefined;

    constructor(currentPlayer: Player, gameFacade: IGameFacade){
        this.currentPlayer = currentPlayer;
        this.gameFacade = gameFacade;
    }
    notify(sender: Component, event: string): void {
        if(sender instanceof SelectedTile && event === "Enemie"){
            this.selctedTileInfo = sender;
            if (this.currentPlayer.attackTurns.length < 1) 
                {
                toast.error("Sorry, it is not your turn!", { id: "not-your-turn-toast" });
              }
              else{
              const turn = this.currentPlayer.attackTurns[0];
              turn.tile = this.selctedTileInfo.getile() as MapTile;
                
            }
        }
        else if(sender instanceof SelectedTile && event === "Own"){
            const turn = this.currentPlayer.attackTurns[0];
            turn.tile = undefined!;
            toast.error("Cannot attack own ships!", { id: "own-ship-attack-toast" });
        }
        else if(sender instanceof AmmoSelect && event === "Set"){
            this.selectedAmmoInfo = sender;
        }
        else if(sender instanceof AmmoSelect && event === "Select"){
            this.selectedAmmoInfo = sender;
            this.currentPlayer.attackTurns[0].ammo = sender.getAmmo();
        }
        else if(sender instanceof SelectedTile && event === "Set"){
            this.selctedTileInfo = sender;
        }
        else if(sender instanceof ButtonClicked && event === "Undo"){
            this.gameFacade.sendEvent(MatchEventNames.UndoCommand, {
                userId: this.currentPlayer.id,
              });
        }
        else if(sender instanceof ButtonClicked && event === "Attack"){
            const turn = this.currentPlayer.attackTurns[0];
    
            console.log(turn.ammo, this.selectedAmmoInfo?.getAmmo());
            if (!turn.ammo && this.selectedAmmoInfo?.getAmmo()) {
                turn.ammo = this.selectedAmmoInfo.getAmmo();
            }
    
            if (!turn.tile || !turn.ammo) {
                    toast.error("Select ammo and tile to attack first!", {
                        id: "attack-toast",
                    });
            }
            else{
                turn.ammo.onAttack(this.gameFacade, this.currentPlayer, turn, turn.tile);
                if(this.selctedTileInfo)
                {
                    this.selctedTileInfo.setTile(null);
                }  
            }
        }
    }

}