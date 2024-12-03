import { Memento } from "@/models/MatchMemento";
import { toast } from "sonner";
import MatchProvider from "./MatchProvider/MatchProvider";

// DESIGN PATTERN: 22. Memento
export class MatchCaretaker {
  private mementos: Memento[] = [];

  constructor() {}

  save() {
    this.mementos.push(MatchProvider.Instance.match.saveState());
  }

  restore() {
    const memento = this.mementos.pop();

    if (memento) {
      MatchProvider.Instance.match.restoreState(memento);
      toast.success("State restored");
    } else {
      toast.error("No more states to restore");
    }
  }
}
