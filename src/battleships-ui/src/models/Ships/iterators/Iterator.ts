// DESIGN PATTERN: 14. Iterator
export interface Iterator<T> {
  next(): T;
  hasNext(): boolean;
  first(): T;
  reset(): void;
}
