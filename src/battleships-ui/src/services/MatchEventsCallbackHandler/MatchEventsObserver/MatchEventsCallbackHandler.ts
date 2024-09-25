import { MatchEventNames } from '../../HubConnectionService/HubConnectionService';
import MatchEventsCallbackInvokeable from './MatchEventsInvokeable';

export default class MatchEventsCallbackHandler {
  protected invokeables: {
    [event: number]: MatchEventsCallbackInvokeable[];
  } = {};

  constructor() {
    for (const event in MatchEventNames) {
      // iterator contains `number` type keys, then `string` type values
      if (isNaN(Number(event))) {
        break;
      }

      this.invokeables[event] = [];
    }
  }

  public notify(event: MatchEventNames, data: any): void {
    const eventObservers = this.invokeables[event];

    eventObservers?.forEach((observer) => observer.onNotify(data));
  }

  public add(event: MatchEventNames, action: (data: any) => void) {
    this.invokeables[event].push(new MatchEventsCallbackInvokeable(action));
  }

  public addSingular(event: MatchEventNames, action: (data: any) => void) {
    if (this.invokeables[event].length === 0) {
      this.invokeables[event].push(new MatchEventsCallbackInvokeable(action));
    }
  }

  public remove(event: MatchEventNames) {
    this.invokeables[event] = [];
  }
}
