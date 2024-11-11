import { Iterator } from "./Iterator";

export class ArrayIterator<T> implements Iterator<T> {
  private items: T[];
  private position: number = 0;

  constructor(items: T[]) {
    this.items = items;
  }


  next(): T {
    return this.items[this.position++];
  }

  hasNext(): boolean {
    return this.position < this.items.length;
  }

  first(): T {
    this.position = 0;
    return this.items[this.position];
  }

  reset(): void {
    this.position = 0;
    }
}
