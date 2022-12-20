export enum PatternTypes {
  Singleton,
  Factory,
  AbstractFactory,
  Strategy,
  Observer,
  Builder,
  Adapter,
  Prototype,
  Decorator,
  Command,
  Facade,
  Bridge,
  Template,
  State,
  Interpreter,
}

export default class LoggerService {
  private static _instance: LoggerService;

  private loggers: { [pattern: number]: [Logger, boolean] } = {};

  private constructor() {
    for (const pattern in PatternTypes) {
      if (isNaN(Number(pattern))) {
        break;
      }

      const logger = new Logger(console.log, () => this.loggers[pattern][1]);

      this.loggers[pattern] = [logger, false];
    }
  }

  public getLogger(pattern: PatternTypes): Logger {
    return this.loggers[pattern][0];
  }

  public toggle(pattern: PatternTypes): void {
    this.loggers[pattern][1] = !this.loggers[pattern][1];
  }

  public status(pattern: PatternTypes): boolean {
    return this.loggers[pattern][1];
  }

  public static get Instance(): LoggerService {
    this._instance ??= new LoggerService();

    return this._instance;
  }
}

export class Logger {
  constructor(log: (...data: any[]) => void, matcher: () => boolean) {
    this.log = (...data: any[]) => {
      if (matcher()) {
        log(...data);
      }
    };
  }

  public log: (...data: any[]) => void;
}
