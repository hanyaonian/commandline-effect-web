export interface TermnialEventsHandler extends HTMLElementEventMap, CustomEvents {}

interface CustomEvents {
  "input-finish": (this: HTMLElement, event: TerminalBoxEvent<string>) => any;
  "start-typing": (this: HTMLElement, event: TerminalBoxEvent<void>) => any;
  "typing-finish": (this: HTMLElement, event: TerminalBoxEvent<void>) => any;
}

export type TerminalBoxEventsName = keyof CustomEvents;

export class TerminalBoxEvent<T> extends Event {
  constructor(
    name: TerminalBoxEventsName,
    readonly data?: T,
  ) {
    super(name, {
      bubbles: true,
      cancelable: true,
    });
  }
}
