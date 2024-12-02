import { ShipComponent } from "./ShipComponent";

// DESIGN PATTERN: 15. Composite
class ShipComposite implements ShipComponent {
  private ships: ShipComponent[] = [];
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  display(): string {
    let result = `[${this.name}] Displaying composite ships\n`;

    for (const ship of this.ships) {
      result += "\t\t" + ship.display() + "\n";
    }

    return result;
  }

  add(ship: ShipComponent): void {
    this.ships.push(ship);
  }

  remove(ship: ShipComponent): void {
    const index = this.ships.indexOf(ship);

    if (index !== -1) {
      this.ships.splice(index, 1);
    }
  }

  getChild(index: number): ShipComponent {
    return this.ships[index];
  }
}

export default ShipComposite;
