import { MapTile } from "@/models/MatchMap";
import { ShipPart } from "@/models/Ships/ShipPart";


// DESIGN PATTERN: 13. Template method
abstract class ShipCheck{
    tile: MapTile;
    isEnemyMap: boolean;
    currentPart?: ShipPart;
    constructor(tile: MapTile, isEnemyMap: boolean){
        this.tile = tile;
        this.isEnemyMap = isEnemyMap;
        this.currentPart = tile.shipPart;
    }
    public performCheck(): string{
        let info = undefined;
        while(this.currentPart){
            info = this.check(this.currentPart, this.isEnemyMap, this.tile);
            if (info !== undefined){
                return info as string;  
            }
            this.currentPart = (this.currentPart as any).decoratedShipPart;
        }
        return "";
    }
    abstract check(currentPart: ShipPart, isEnemyMap: boolean, _tile:MapTile): string | undefined;

}

export class TextCheck extends ShipCheck{
    check(currentPart: ShipPart, isEnemyMap: boolean, _tile: MapTile): string | undefined {
        if ("shipPartName" in currentPart && !isEnemyMap) {
            return (currentPart as any).shipPartName;
        }
        return undefined;
    }
    
}

export class VisibilityCheck extends ShipCheck{
    check(currentPart: ShipPart, isEnemyMap: boolean, _tile:MapTile): string | undefined {
        if ("visibilityLevel" in currentPart && !isEnemyMap) {
            return (currentPart as any).visibilityLevel;
        }
        return undefined;
    }
    
}

export class ColorCheck extends ShipCheck{
    check(currentPart: ShipPart, isEnemyMap: boolean, _tile: MapTile): string | undefined {
        if ("shipPartColor" in currentPart && !isEnemyMap) {
            return (currentPart as any).shipPartColor;
        }
        return undefined;
    }
    
}
export class HpCheck extends ShipCheck{
    check(currentPart: ShipPart, isEnemyMap: boolean, _tile: MapTile): string | undefined {
        if ("hp" in currentPart && !isEnemyMap && _tile.shipPart !== undefined ) {
            return (currentPart as any).hp.toString();
        }
        return undefined;
    }
    
}