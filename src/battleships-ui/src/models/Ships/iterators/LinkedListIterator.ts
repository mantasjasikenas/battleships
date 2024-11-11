import { Iterator } from "./Iterator";

export class LinkedListIterator<T> implements Iterator<T> {
  private head: Node<T> | null;
  private current: Node<T> | null;

  constructor(head: Node<T> | null) {
    this.head = head;
    this.current = head;
  }

  next(): T {
    if (this.current === null) {
      throw new Error("No more elements");
    }
    const value = this.current.value;

    this.current = this.current.next;

    return value;
  }

  hasNext(): boolean {
    return this.current !== null;
  }

  first(): T {
    if (this.head === null) {
      throw new Error("No elements");
    }

    this.current = this.head;

    return this.head.value;
  }

  reset(): void {
    this.current = this.head;
  }
}

export class Node<T> {
  value: T;
  next: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}
