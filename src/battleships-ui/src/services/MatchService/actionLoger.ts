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
        this.onAttackTurnTargetTileSelect = this.onAttackTurnTargetTileSelect.bind(this);
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

    private selectedAmmo: Ammo | null;
    constructor(mediator: Mediator){
        super(mediator)
        this.selectedAmmo = null;
        this.getAmmo = this.getAmmo.bind(this);
        this.setAmmo = this.setAmmo.bind(this);
        this.AttackSelect = this.AttackSelect.bind(this);
    }
    getAmmo(){
        return this.selectedAmmo;
    }
    setAmmo(ammo: Ammo | null){
        this.selectedAmmo = ammo;
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
    selectedTile: MapTile | null;
    selectedAmmo: Ammo | null;

    constructor(currentPlayer: Player, gameFacade: IGameFacade){
        this.currentPlayer = currentPlayer;
        this.gameFacade = gameFacade;
        this.selectedTile = null
        this.selectedAmmo = null;
    }
    notify(sender: Component, event: string): void {
        if(sender instanceof SelectedTile && event === "Enemie"){
            if (this.currentPlayer.attackTurns.length < 1) 
                {
                toast.error("Sorry, it is not your turn!", { id: "not-your-turn-toast" });
              }
              else{
                this.selectedTile = sender.getile();
              const turn = this.currentPlayer.attackTurns[0];
              turn.tile = this.selectedTile as MapTile;
                
            }
        }
        else if(sender instanceof SelectedTile && event === "Own"){
            const turn = this.currentPlayer.attackTurns[0];
            turn.tile = undefined!;
            toast.error("Cannot attack own ships!", { id: "own-ship-attack-toast" });
        }
        else if(sender instanceof AmmoSelect && event === "Select"){
            this.selectedAmmo = sender.getAmmo();
            this.currentPlayer.attackTurns[0].ammo = sender.getAmmo() as Ammo;
        }
        else if(sender instanceof ButtonClicked && event === "Undo"){
            this.gameFacade.sendEvent(MatchEventNames.UndoCommand, {
                userId: this.currentPlayer.id,
              });
        }
        else if(sender instanceof ButtonClicked && event === "Attack"){
            const turn = this.currentPlayer.attackTurns[0];
    
            console.log(turn.ammo, this.selectedAmmo);
            if (!turn.ammo && this.selectedAmmo) {
                turn.ammo = this.selectedAmmo;
            }
    
            if (!turn.tile || !turn.ammo) {
                    toast.error("Select ammo and tile to attack first!", {
                        id: "attack-toast",
                    });
            }
            else{
                turn.ammo.onAttack(this.gameFacade, this.currentPlayer, turn, turn.tile);
                    this.selectedTile = null
            }
        }
    }

}