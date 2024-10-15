export default class MatchEventsCallbackInvokeable {
  constructor(onNotify: (data: string) => void) {
    this.onNotify = (data: string) => {
      onNotify(data);
    };
  }

  onNotify: (data: string) => void;
}
