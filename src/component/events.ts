export interface TermnialEventsHandler {
  "input-finish": (value: string) => void;
  "typing-finish": () => void;
}

export type TerminalBoxEvents = keyof TermnialEventsHandler;

export class CustomEvents<T> extends Event {
  constructor(
    name: TerminalBoxEvents,
    readonly data?: T,
  ) {
    super(name, {
      bubbles: true,
      cancelable: true,
    });
  }
}
