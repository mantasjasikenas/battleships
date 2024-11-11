import { Iterator } from "./Iterator";
import { ArrayIterator } from "./ArrayIterator";
import { HashtableIterator } from "./HashtableIterator";
import { LinkedListIterator, Node } from "./LinkedListIterator";
import { Ammo } from "@/models/Ammo";

export enum CollectionType {
  ARRAY,
  LINKED_LIST,
  HASHTABLE,
}

export class AmmoCollection {
  private ammoArray: Ammo[] = [];
  private ammoLinkedList: Node<Ammo> | null = null;
  private ammoHashtable: Map<string, Ammo> = new Map();

  private collectionType: CollectionType;

  constructor(collectionType: CollectionType = CollectionType.ARRAY) {
    this.collectionType = collectionType;
  }

  addAmmo(ammo: Ammo): void {
    switch (this.collectionType) {
      case CollectionType.ARRAY: {
        this.ammoArray.push(ammo);

        break;
      }
      case CollectionType.LINKED_LIST: {
        const newNode = new Node(ammo);

        if (this.ammoLinkedList === null) {
          this.ammoLinkedList = newNode;
        } else {
          let current = this.ammoLinkedList;
          while (current.next !== null) {
            current = current.next;
          }
          current.next = newNode;
        }

        break;
      }
      case CollectionType.HASHTABLE: {
        this.ammoHashtable.set(ammo.name, ammo);

        break;
      }
      default:
        throw new Error("Invalid collection type");
    }
  }

  createIterator(): Iterator<Ammo> {
    switch (this.collectionType) {
      case CollectionType.ARRAY:
        return new ArrayIterator(this.ammoArray);
      case CollectionType.LINKED_LIST:
        return new LinkedListIterator(this.ammoLinkedList);
      case CollectionType.HASHTABLE:
        return new HashtableIterator(this.ammoHashtable);
      default:
        throw new Error("Invalid collection type");
    }
  }

  get values(): Ammo[] {
    const iterator = this.createIterator();
    const result: Ammo[] = [];

    while (iterator.hasNext()) {
      result.push(iterator.next());
    }

    return result;
  }
}
