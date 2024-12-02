import { ShipClass } from "@/models/Ships/ShipClass";
import { ShipPart } from "@/models/Ships/ShipPart";
import { ShipComponent } from "./ShipComponent";

export class ShipLeaf implements ShipComponent {
  private shipPart: ShipPart;
  private shipClass: ShipClass | undefined;

  constructor(shipPart: ShipPart, shipClass: ShipClass | undefined) {
    this.shipPart = shipPart;
    this.shipClass = shipClass;
  }

  display(): string {
    const shipClassDisplay = this.shipClass
      ? `(${ShipClass[this.shipClass]})`
      : "(no class)";

    const hp = "hp" in this.shipPart ? (this.shipPart.hp as number) : undefined;
    const initialHp =
      "initialHp" in this.shipPart
        ? (this.shipPart.initialHp as number)
        : undefined;

    let shipPartDetails = "Classic part";

    if (hp !== undefined && initialHp !== undefined) {
      shipPartDetails = `HP: ${hp}/${initialHp}`;
    }

    const status = this.shipPart.isDestroyed
      ? "sunk"
      : hp !== undefined && initialHp !== undefined && hp < initialHp
        ? "damaged"
        : "healthy";

    return `\t\t${status} ${shipClassDisplay} - ${shipPartDetails}`;
  }
}

export default ShipLeaf;
