import { Iterator } from "./Iterator";

export class HashtableIterator<T> implements Iterator<T> {
  private items: Map<string, T>;
  private keys: string[];
  private position: number = 0;

  constructor(items: Map<string, T>) {
    this.items = items;
    this.keys = Array.from(items.keys());
  }

  next(): T {
    if (this.position >= this.keys.length) {
      throw new Error("No more elements");
    }

    const key = this.keys[this.position];
    const value = this.items.get(key);

    if (value === undefined) {
      throw new Error("No more elements");
    }

    this.position++;
    return value;
  }

  hasNext(): boolean {
    return this.position < this.keys.length;
  }

  first(): T {
    this.position = 0;

    if (this.keys.length === 0) {
      throw new Error("No elements");
    }

    const value = this.items.get(this.keys[this.position]);

    if (value === undefined) {
      throw new Error("No elements");
    }

    return value;
  }

  reset(): void {
    this.position = 0;
  }
}
