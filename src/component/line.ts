import Typed from "typed.js";
import EventEmitter from "eventemitter3";

export class TerminalLine extends EventEmitter {
  public typed: Typed;

  constructor(
    private readonly configs: {
      el: string | HTMLElement | Node;
      content: string;
      speed: number;
      type: "input" | "respond";
    },
  ) {
    super();
  }

  public start() {
    this.typed = new Typed(this.configs.el, {
      strings: [this.configs.content],
      typeSpeed: this.configs.speed,
      bindInputFocusEvents: true,
      onBegin: () => {
        this.emit("typing");
      },
      onComplete: () => {
        this.emit("complete");
      },
    });
  }

  public clear() {
    this.typed.destroy();
  }
}
