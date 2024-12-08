import { MapTile } from "@/models/MatchMap";
import { Ammo } from "@/models/Ammo";
import { Mediator } from "@/components/MatchDisplay/MatchDisplay";

export class attackEvent {
    mediator : Mediator;
    constructor(mediator: Mediator){
        this.mediator = mediator;
    }
}

export class SelectedTile extends attackEvent{
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

export class AmmoSelect extends attackEvent{

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

export class ButtonClicked  extends attackEvent{
    onAttack(): void {
        this.mediator.notify(this, "Attack");
      }

      onUndo(): void {
        this.mediator.notify(this, "Undo");
      }
}



