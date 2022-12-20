import { MatchEventNames } from '../../ConnectionMediatorService/ConnectionMediatorService';
import MatchEventsCallbackInvokeable from './MatchEventsInvokeable';

export default class MatchEventsCallbackHandler {
  protected observersByEvent: {
    [event: number]: MatchEventsCallbackInvokeable[];
  } = {};

  constructor() {
    for (const event in MatchEventNames) {
      // iterator contains `number` type keys, then `string` type values
      if (isNaN(Number(event))) {
        break;
      }

      this.observersByEvent[event] = [];
    }
  }

  public notify(event: MatchEventNames, data: any): void {
    const eventObservers = this.observersByEvent[event];

    eventObservers?.forEach((observer) => observer.onNotify(data));
  }

  public add(event: MatchEventNames, action: (data: any) => void) {
    this.observersByEvent[event].push(
      new MatchEventsCallbackInvokeable(action)
    );
  }

  public addSingular(event: MatchEventNames, action: (data: any) => void) {
    if (this.observersByEvent[event].length === 0) {
      this.observersByEvent[event].push(
        new MatchEventsCallbackInvokeable(action)
      );
    }
  }
}
